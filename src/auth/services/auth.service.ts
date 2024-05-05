import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { RegisterDTO } from '../dto/register.dto';
import { UserService } from 'src/user/services/user.service';
import { AuthProviderType } from '../types';
import { LinkAccountEvent, RegisterEvent } from '../events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emitter: EventEmitter2,
  ) {}
  getTokenForUser(user: UserAttributes) {
    return this.jwtService.signAsync({ id: user.id });
  }

  async register(registerDTO: RegisterDTO, requireVerification: boolean) {
    const user = await this.userService.create(
      registerDTO,
      !requireVerification,
    );

    new RegisterEvent(user, AuthProviderType.LOCAL).publish(this.emitter);
  }

  async linkAccountRequest(user: UserAttributes) {
    user.confirmationToken = uuid();
    user.confirmationTokenExpiredAt = dayjs().add(ms('1d'), 'ms').toDate();
    await user.save();
    new LinkAccountEvent(user).publish(this.emitter);
  }

  async linkAccount(user: UserAttributes, data: Omit<RegisterDTO, 'email'>) {
    user.username = data.username;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.password = data.password;
    await UserAttributes.hashPassword(user);
    user.confirmationToken = null;
    user.confirmationTokenExpiredAt = null;
    await user.save();
  }
}
