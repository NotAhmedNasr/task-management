import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAttributes } from './models/userAttributes.model';

@Module({
  imports: [SequelizeModule.forFeature([UserAttributes])],
  controllers: [UserController],
  providers: [UserService],
  exports: [SequelizeModule, UserService],
})
export class UserModule {}
