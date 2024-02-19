import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'identifier' });
  }

  async validate(identifier: string, password: string) {
    const user = await this.userService.findByUsernameOrEmail(
      identifier,
      identifier,
      'login',
    );

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
