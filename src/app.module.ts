import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';

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
    HealthModule,
    UserModule,
    AuthModule,
    NotificationModule,
  ],
})
export class AppModule {}
