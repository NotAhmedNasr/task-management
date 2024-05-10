import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalAuthController } from './controllers/local.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthProviderAttributes } from './models/authProviderAttributes.model';
import { AuthProviderService } from './services/authProvider.service';
import { OAuth2Controller } from './controllers/oauth.controller';
import { LoginAttempt } from './models/loginAttempt.model';
import { LoginHistoryService } from './services/loginHistory.service';
import { DynamicAuthModuleClass } from './auth.module-definition';
import { EventsService } from './events/events.service';
import { LogController } from './controllers/log.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([AuthProviderAttributes, LoginAttempt]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),
    UserModule,
  ],
  controllers: [LocalAuthController, OAuth2Controller, LogController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthProviderService,
    LoginHistoryService,
    EventsService,
  ],
})
export class AuthModule extends DynamicAuthModuleClass {}
