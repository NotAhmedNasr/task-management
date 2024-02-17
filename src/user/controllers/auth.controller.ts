import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('/login')
  login() {
    // get User
    // check password
    // get token
    // return user with token
    this.authService.getTokenForUser({});
    return { token: 'token' };
  }

  @Post('/register')
  register() {
    // validate
    // create
    // add token
    // return user with token
    const user = this.userService.create();
    return user;
  }
}
