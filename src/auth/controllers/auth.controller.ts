import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticatedRequest } from 'src/types';
import { MailNotificationService } from 'src/notification/services/mail.service';
import { EmailNotification } from 'src/notification/classes/notification';
import { MailTemplateFactory } from 'src/notification/classes/mailTemplateFactory';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from '../guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailNotificationService,
    private readonly configService: ConfigService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: AuthenticatedRequest) {
    const token = await this.authService.getTokenForUser(req.user);

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
        html: await MailTemplateFactory.confirmation(
          user,
          `${this.configService.get<string>('host')}:${this.configService.get<string>('port')}`,
        ),
      },
      this.mailService.getMailTransporter(),
    );
    // TODO handle confirmation sending failure
    confirmation
      .send()
      .catch((err) =>
        console.error('failed to send confirmation message', err),
      );
    return {
      message: 'email verification required',
    };
  }

  @Get('/verify')
  async confirmEmail(@Query('token') cToken: string) {
    const user = await this.userService.findByConfirmationToken(cToken);
    if (!user) {
      throw new NotFoundException();
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }
    user.emailVerified = true;
    user.confirmationToken = null;
    await user.save();
    return {
      message: 'success',
    };
  }

  // TODO generalize oauth2 for all providers
  @UseGuards(GoogleAuthGuard)
  @Get('/oauth2/google')
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('/oauth2/redirect/google')
  async googleCallback(@Request() req: AuthenticatedRequest) {
    const token = await this.authService.getTokenForUser(req.user);

    return {
      token,
      user: req.user.toJSON(),
    };
  }
}
