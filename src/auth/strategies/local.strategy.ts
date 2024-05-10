import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/services/user.service';
import { AuthProviderType, LoginFailureReason } from '../types';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FailedLoginEvent } from '../events/events';
import {
  AuthModuleOptions,
  InjectAuthOptions,
} from '../auth.module-definition';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly emitter: EventEmitter2,
    @InjectAuthOptions() private readonly authOptions: AuthModuleOptions,
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
      new FailedLoginEvent(
        user,
        AuthProviderType.LOCAL,
        req.ip,
        req.get('user-agent'),
        LoginFailureReason.INVALID_CREDENTIALS,
      ).publish(this.emitter);
      throw new UnauthorizedException();
    }

    if (user.blocked) {
      new FailedLoginEvent(
        user,
        AuthProviderType.LOCAL,
        req.ip,
        req.get('user-agent'),
        LoginFailureReason.BLOCK,
      ).publish(this.emitter);
      throw new ForbiddenException('blocked');
    }

    if (!user.emailVerified && this.authOptions.requireEmailVerification) {
      throw new UnauthorizedException('email verification required');
    }

    return user;
  }
}
