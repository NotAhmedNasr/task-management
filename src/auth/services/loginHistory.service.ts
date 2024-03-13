import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LoginAttempt } from '../models/loginAttempt.model';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { AuthProviderType, LoginFailureReason } from '../types';

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
    success: boolean,
    failureReason?: LoginFailureReason,
  ) {
    return this.loginAttemptModel.create({
      userId: user.id,
      type,
      address,
      success,
      failureReason,
    });
  }
}
