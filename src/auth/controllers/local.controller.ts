import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { RegisterDTO } from '../dto/register.dto';
import { AuthProviderType } from '../types';
import { VerifyDTO } from '../dto/verify.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginEvent } from '../events/events';
import {
  AuthModuleOptions,
  InjectAuthOptions,
} from '../auth.module-definition';
import { User } from '../decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { LinkAccountRequestDTO, LinkAccountDTO } from '../dto/linkAccount.dto';
import dayjs from 'dayjs';

@Controller('local')
export class LocalAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emitter: EventEmitter2,
    @InjectAuthOptions()
    private readonly authOptions: AuthModuleOptions,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @User() user: UserAttributes,
    @Ip() ip: string,
    @Headers('user-agent') agent: string,
  ) {
    const token = await this.authService.getTokenForUser(user);
    new LoginEvent(user, AuthProviderType.LOCAL, ip, agent).publish(
      this.emitter,
    );
    return {
      token,
      user: user.toJSON(),
    };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDTO: RegisterDTO) {
    const existing = await this.userService.findByUsernameOrEmail(
      registerDTO.username,
      registerDTO.email,
      'login',
    );

    if (existing?.username === registerDTO.username) {
      throw new BadRequestException('username is already taken!');
    }

    if (existing?.email === registerDTO.email) {
      // not local provider
      if (!existing.password) {
        throw new ConflictException('email is in use through auth provider');
      }
      throw new BadRequestException('email is already taken!');
    }

    const response = await this.authService
      .register(registerDTO, this.authOptions.requireEmailVerification)
      .then(() => {
        return this.authOptions.requireEmailVerification
          ? {
              code: 'EMAIL_VERIFICATION_REQUIRED',
              message: 'email verification required',
            }
          : {
              code: 'REGISTRATION_SUCCESS',
              message: 'registration was successful',
            };
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });

    return response;
  }

  @Get('/verify')
  async confirmEmail(@Query() query: VerifyDTO) {
    const user = await this.userService.findByConfirmationToken(query.token);
    if (!user) {
      throw new BadRequestException('invalid token');
    }
    if (dayjs().isAfter(user.confirmationTokenExpiredAt)) {
      throw new BadRequestException('expired token');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    user.emailVerified = true;
    user.confirmationTokenExpiredAt = new Date();
    await user.save();
    return {
      message: 'success',
    };
  }

  // Used to add local auth attributes (username, password) to accounts created using auth providers
  @Post('/linkAccountRequest')
  async linkAccountRequest(@Body() body: LinkAccountRequestDTO) {
    const user = await this.userService.findByEmail(body.email, 'login');
    if (!user) throw new BadRequestException('email is invalid');
    if (user.password) {
      throw new BadRequestException('user is already linked');
    }
    await this.authService.linkAccountRequest(user);

    return {
      code: 'EMAIL_VERIFICATION_REQUIRED',
      message: 'email verification required',
    };
  }

  @Post('/linkAccount')
  async linkAccount(@Body() { token, data }: LinkAccountDTO) {
    const user = await this.userService.findByConfirmationToken(token);
    if (!user) {
      throw new BadRequestException('invalid token');
    }
    if (dayjs().isAfter(user.confirmationTokenExpiredAt)) {
      throw new BadRequestException('expired token');
    }
    if (await this.userService.findByUsername(data.username)) {
      throw new BadRequestException('username is already taken!');
    }

    await this.authService.linkAccount(user, data);

    return {
      message: 'success',
    };
  }
}
