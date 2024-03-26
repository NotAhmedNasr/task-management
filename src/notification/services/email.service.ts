import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import { SMTPOptions } from '../types';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    this.smtpOptions = this.configService.get<SMTPOptions>('smtp');
    this.mailTransporter = createTransport(
      {
        host: this.smtpOptions.host,
        port: this.smtpOptions.port,
        auth: {
          user: this.smtpOptions.username,
          pass: this.smtpOptions.password,
        },
      },
      {
        from: this.smtpOptions.from,
      },
    );
  }
  private mailTransporter: Transporter;
  private readonly smtpOptions: SMTPOptions;

  async send(message: Mail.Options) {
    return this.mailTransporter.sendMail(message);
  }
}
