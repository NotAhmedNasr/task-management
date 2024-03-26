import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
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
import { verifyDTO } from '../dto/verify.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoginEvent, RegisterEvent } from '../events/events';
import {
  AuthModuleOptions,
  InjectAuthOptions,
} from '../auth.module-definition';
import { User } from '../decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';

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
    );

    if (existing?.username === registerDTO.username) {
      throw new BadRequestException('username is already taken!');
    } else if (existing?.email === registerDTO.email) {
      throw new BadRequestException('email is already taken!');
    }

    const user = await this.userService.create(
      registerDTO,
      !this.authOptions.requireEmailVerification,
    );

    new RegisterEvent(user, AuthProviderType.LOCAL).publish(this.emitter);

    const response = this.authOptions.requireEmailVerification
      ? {
          code: 'EMAIL_VERIFICATION_REQUIRED',
          message: 'email verification required',
        }
      : {
          code: 'REGISTRATION_SUCCESS',
          message: 'registration was successful',
        };
    return response;
  }

  @Get('/verify')
  async confirmEmail(@Query() query: verifyDTO) {
    const user = await this.userService.findByConfirmationToken(query.token);
    if (!user) {
      throw new BadRequestException('invalid token');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    user.emailVerified = true;
    await user.save();
    return {
      message: 'success',
    };
  }
}
