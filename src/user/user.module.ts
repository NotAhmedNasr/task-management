import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAttributes } from './models/userAttributes.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([UserAttributes]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),
  ],
  exports: [SequelizeModule],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class UserModule {}
