import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LoginAttempt } from '../models/loginAttempt.model';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { AuthProviderType, LoginFailureReason } from '../types';

interface GetHistoryParams {
  user: UserAttributes;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectModel(LoginAttempt)
    private readonly loginAttemptModel: typeof LoginAttempt,
  ) {}

  log(
    user: UserAttributes,
    type: AuthProviderType,
    address: string,
    agent: string,
    success: boolean,
    failureReason?: LoginFailureReason,
  ) {
    return this.loginAttemptModel.create({
      userId: user.id,
      type,
      address,
      success,
      failureReason,
      agent,
    });
  }

  get({ user, page = 1, pageSize = 10 }: GetHistoryParams) {
    return this.loginAttemptModel.findAndCountAll({
      where: {
        userId: user.id,
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      attributes: ['type', 'success', 'address', 'agent', 'time'],
      order: [['time', 'DESC']],
    });
  }
}
