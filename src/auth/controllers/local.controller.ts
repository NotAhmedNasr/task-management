import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticatedRequest } from 'src/types';
import { MailNotificationService } from 'src/notification/services/mail.service';
import { EmailNotification } from 'src/notification/classes/notification';
import { MailTemplateFactory } from 'src/notification/classes/mailTemplateFactory';
import { LoginHistoryService } from '../services/loginHistory.service';
import { AuthProviderType } from '../types';
import { verifyDTO } from '../dto/verify.dto';

@Controller('local')
export class LocalAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailNotificationService,
    private readonly configService: ConfigService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: AuthenticatedRequest) {
    const token = await this.authService.getTokenForUser(req.user);
    this.loginHistoryService.log(
      req.user,
      AuthProviderType.LOCAL,
      req.ip,
      true,
    );
    return {
      token,
      user: req.user.toJSON(),
    };
  }

  @Post('/register')
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

    const user = await this.userService.create(registerDTO);
    const confirmation = new EmailNotification(
      {
        to: user.email,
        from: this.mailService.smtpOptions.from,
        subject: 'Email Confirmation',
        html: await MailTemplateFactory.emailConfirmation(
          `${user.firstName} ${user.lastName}`,
          `${this.configService.get<string>('clientUrl')}/auth/verifyEmail?token=${user.confirmationToken}`,
        ),
      },
      this.mailService.getMailTransporter(),
    );
    // TODO handle confirmation sending failure
    confirmation
      .send()
      .then(console.log)
      .catch((err) =>
        console.error('failed to send confirmation message', err),
      );
    return {
      message: 'email verification required',
    };
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
