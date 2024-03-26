import { MailMessage } from '../types';

export abstract class NotificationBase {
  abstract send(): Promise<unknown>;
}

export class EmailNotification extends NotificationBase {
  constructor(
    private message: MailMessage,
    private sendEmailFunc: (message: MailMessage) => Promise<unknown>,
  ) {
    super();
  }
  async send() {
    return this.sendEmailFunc(this.message);
  }
}
