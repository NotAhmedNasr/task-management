import { Injectable } from '@nestjs/common';
import { AuthProviderAttributes } from '../models/authProviderAttributes.model';
import { InjectModel } from '@nestjs/sequelize';
import { AuthProviderType } from '../types';
import { UserAttributes } from 'src/user/models/userAttributes.model';

@Injectable()
export class AuthProviderService {
  constructor(
    @InjectModel(AuthProviderAttributes)
    private readonly authProviderModel: typeof AuthProviderAttributes,
  ) {}

  async findByIdentifier(type: AuthProviderType, identifier: string) {
    return this.authProviderModel.findOne({
      where: {
        type,
        identifier,
      },
      include: UserAttributes,
    });
  }

  createLazy(type: AuthProviderType, identifier: string, email?: string) {
    return this.authProviderModel.build({
      type,
      identifier,
      email,
    });
  }
}
