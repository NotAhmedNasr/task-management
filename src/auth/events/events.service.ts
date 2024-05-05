import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AuthEventType,
  FailedLoginEvent,
  LinkAccountEvent,
  LoginEvent,
  RegisterEvent,
} from './events';
import { LoginHistoryService } from '../services/loginHistory.service';
import { EmailNotification } from 'src/notification/classes/notification';
import { AuthProviderType } from '../types';
import {
  AuthModuleOptions,
  InjectAuthOptions,
} from '../auth.module-definition';
import { MailTemplateFactory } from '../utils/email/mailTemplateFactory';

@Injectable()
export class EventsService {
  constructor(
    private readonly loginHistoryService: LoginHistoryService,
    @InjectAuthOptions() private authOptions: AuthModuleOptions,
  ) {}
  @OnEvent(AuthEventType.LOGIN)
  async onLogin(data: LoginEvent) {
    this.loginHistoryService.log(
      data.user,
      data.loginType,
      data.address,
      data.agent,
      data.success,
    );
  }

  @OnEvent(AuthEventType.FAILED_LOGIN)
  async onFailedLogin(data: FailedLoginEvent) {
    this.loginHistoryService.log(
      data.user,
      data.loginType,
      data.address,
      data.agent,
      data.success,
      data.failureReason,
    );
  }

  @OnEvent(AuthEventType.REGISTER)
  async onRegister({ user, type }: RegisterEvent) {
    if (
      type === AuthProviderType.LOCAL &&
      this.authOptions.requireEmailVerification
    ) {
      new EmailNotification(
        {
          to: user.email,
          subject: 'Email Confirmation',
          html: await MailTemplateFactory.emailConfirmation(
            `${user.firstName} ${user.lastName}`,
            `${this.authOptions.clientUrl}/auth/verifyEmail?token=${user.confirmationToken}`,
          ),
        },
        this.authOptions.sendEmailFunction,
      )
        .send()
        .then(console.log)
        .catch((err) =>
          console.error('failed to send confirmation message', err),
        );
    }
  }

  @OnEvent(AuthEventType.LINK_ACCOUNT)
  async onLinkAccount({ user }: LinkAccountEvent) {
    new EmailNotification(
      {
        to: user.email,
        subject: 'Email Confirmation',
        html: await MailTemplateFactory.emailConfirmation(
          `${user.firstName} ${user.lastName}`,
          `${this.authOptions.clientUrl}/auth/linkAccount?token=${user.confirmationToken}`,
        ),
      },
      this.authOptions.sendEmailFunction,
    )
      .send()
      .then(console.log)
      .catch((err) =>
        console.error('failed to send confirmation message', err),
      );
  }
}
