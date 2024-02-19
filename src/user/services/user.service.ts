import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserAttributes } from '../models/userAttributes.model';
import { RegisterDTO } from '../dtos/register.dto';
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

  findById() {
    // TODO
    return {};
  }

  findByUsernameOrEmail(username: string, email: string, scope?: string) {
    return this.userModel.scope(scope).findOne({
      where: {
        [Op.or]: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
    });
  }

  create(registerDTO: RegisterDTO) {
    return this.userModel.create({ ...registerDTO });
  }
}
