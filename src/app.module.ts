import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    LoggerModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('dbUri'),
        modelMatch: (filename, member) => {
          return filename.split('.model')[0] === member.toLowerCase();
        },
        models: [__dirname + '/models/**.model.**'],
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    UserModule,
  ],
})
export class AppModule {}
