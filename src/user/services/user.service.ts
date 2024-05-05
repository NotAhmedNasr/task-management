import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAttributes } from '../models/userAttributes.model';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserAttributes)
    private userModel: typeof UserAttributes,
  ) {}

  async findMany() {
    // TODO implement filtration and pagination
    const users = await this.userModel.findAll();
    return users;
  }

  findById(id: number) {
    return this.userModel.findOne({ where: { id } });
  }

  findByUsernameOrEmail(username: string, email: string, scope?: 'login') {
    return this.userModel.scope(scope).findOne({
      where: {
        [Op.or]: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
  }

  findByUsername(username: string) {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  findByEmail(email: string, scope?: 'login') {
    return this.userModel.scope(scope).findOne({
      where: {
        email,
      },
    });
  }

  findByConfirmationToken(confirmationToken: string) {
    return this.userModel.findOne({
      where: {
        confirmationToken,
      },
    });
  }

  create(
    registerDTO: RegisterDTO & {
      confirmationToken?: string;
      confirmationTokenExpiredAt?: Date;
    },
    emailVerified = true,
  ) {
    return this.userModel.create({
      ...registerDTO,
      emailVerified,
    });
  }
}
