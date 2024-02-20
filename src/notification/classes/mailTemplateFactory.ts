import { readFile } from 'fs/promises';
import { join } from 'path';
import { UserAttributes } from 'src/user/models/userAttributes.model';

export abstract class MailTemplateFactory {
  static async confirmation(user: UserAttributes, domain: string) {
    const plainTemplate = await readFile(
      join(__dirname, '..', 'templates', 'confirmEmail.template.html'),
      'utf-8',
    );

    return plainTemplate
      .replaceAll('[Name]', `${user.firstName} ${user.lastName}`)
      .replaceAll(
        '[ConfirmationLink]',
        `${domain}/auth/verify?token=${user.confirmationToken}`,
      );
  }
}
