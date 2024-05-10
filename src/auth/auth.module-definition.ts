import { ConfigurableModuleBuilder, Inject } from '@nestjs/common';
import { MailMessage } from 'src/notification/types';

export interface AuthModuleOptions {
  requireEmailVerification: boolean;
  clientUrl: string;
  sendEmailFunction: (message: MailMessage) => Promise<unknown>;
}

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AuthModuleOptions>()
    .setClassMethodName('forRoot')
    .setExtras({ isGlobal: false }, (definition, extras) => {
      return {
        ...definition,
        global: extras.isGlobal,
      };
    })
    .build();

export const DynamicAuthModuleClass = ConfigurableModuleClass;
export const InjectAuthOptions = () => Inject(MODULE_OPTIONS_TOKEN);
