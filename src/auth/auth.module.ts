import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthProviderAttributes } from './models/authProviderAttributes.model';
import { AuthProviderService } from './services/authProvider.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([AuthProviderAttributes]),
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
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    AuthProviderService,
  ],
})
export class AuthModule {}
