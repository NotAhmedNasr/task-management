import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailService } from './notification/services/email.service';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('dbUri'),
        modelMatch: (filename, member) => {
          return filename.split('.model')[0] === member.toLowerCase();
        },
        autoLoadModels: true,
        sync: {
          alter: configService.get<string>('nodeEnv') !== 'production',
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
      delimiter: '.',
      wildcard: false,
    }),
    HealthModule,
    UserModule,
    NotificationModule,
    AuthModule.forRootAsync({
      imports: [ConfigModule, NotificationModule],
      useFactory: (
        configService: ConfigService,
        emailService: EmailService,
      ) => ({
        clientUrl: configService.get<string>('clientUrl'),
        requireEmailVerification: false,
        sendEmailFunction: async (message) => {
          return emailService.send(message);
        },
      }),
      inject: [ConfigService, EmailService],
    }),
    TaskModule,
  ],
})
export class AppModule {}
