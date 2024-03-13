import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/services/user.service';
import { LoginHistoryService } from '../services/loginHistory.service';
import { AuthProviderType, LoginFailureReason } from '../types';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly loginHistoryService: LoginHistoryService,
  ) {
    super({ usernameField: 'identifier', passReqToCallback: true });
  }

  async validate(req: Request, identifier: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(
      identifier,
      identifier,
      'login',
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await user.validatePassword(password))) {
      this.loginHistoryService.log(
        user,
        AuthProviderType.LOCAL,
        req.ip,
        false,
        LoginFailureReason.INVALID_CREDENTIALS,
      );
      throw new UnauthorizedException();
    }

    if (user.blocked) {
      this.loginHistoryService.log(
        user,
        AuthProviderType.LOCAL,
        req.ip,
        false,
        LoginFailureReason.BLOCK,
      );
      throw new ForbiddenException('blocked');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('email verification required');
    }

    return user;
  }
}
