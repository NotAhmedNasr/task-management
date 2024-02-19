import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { SMTPOptions } from '../types';

@Injectable()
export class MailNotificationService {
  constructor(private readonly configService: ConfigService) {
    this.smtpOptions = this.configService.get<SMTPOptions>('smtp');
  }
  private mailTransporter: Transporter;
  readonly smtpOptions: SMTPOptions;
  getMailTransporter() {
    if (!this.mailTransporter) {
      this.mailTransporter = createTransport({
        host: this.smtpOptions.host,
        port: this.smtpOptions.port,
        auth: {
          user: this.smtpOptions.username,
          pass: this.smtpOptions.password,
        },
      });
    }
    return this.mailTransporter;
  }
}
