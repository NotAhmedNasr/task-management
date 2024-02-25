import { readFile } from 'fs/promises';
import { join } from 'path';

export abstract class MailTemplateFactory {
  static async emailConfirmation(name: string, link: string) {
    const plainTemplate = await readFile(
      join(__dirname, '..', 'templates', 'confirmEmail.template.html'),
      'utf-8',
    );
    return plainTemplate
      .replaceAll('[Name]', name)
      .replaceAll('[ConfirmationLink]', link);
  }
}
