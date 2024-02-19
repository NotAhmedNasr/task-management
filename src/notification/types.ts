export interface SMTPOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
}

export interface MailMessage {
  to: string;
  subject: string;
  from?: string;
  text?: string;
  html?: string;
}
