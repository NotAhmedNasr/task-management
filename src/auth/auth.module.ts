import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalAuthController } from './controllers/local.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthProviderAttributes } from './models/authProviderAttributes.model';
import { AuthProviderService } from './services/authProvider.service';
import { OAuth2Controller } from './controllers/oauth.controller';
import { LoginAttempt } from './models/loginAttempt.model';
import { LoginHistoryService } from './services/loginHistory.service';

@Global()
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
    NotificationModule,
  ],
  controllers: [LocalAuthController, OAuth2Controller],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthProviderService,
    LoginHistoryService,
  ],
})
export class AuthModule {}
