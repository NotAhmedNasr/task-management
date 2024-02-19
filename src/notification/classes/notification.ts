import { Transporter } from 'nodemailer';
import { MailMessage } from '../types';

export abstract class NotificationBase {
  abstract send(): void | Promise<void>;
}

export class EmailNotification extends NotificationBase {
  constructor(
    private message: MailMessage,
    private readonly transporter: Transporter,
  ) {
    super();
  }
  async send() {
    await this.transporter.sendMail(this.message);
  }
}
