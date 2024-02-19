import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { RegisterDTO } from '../dtos/register.dto';
import { LoginDTO } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('/login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByUsernameOrEmail(
      loginDTO.identifier,
      loginDTO.identifier,
      'login',
    );

    if (!user || !(await user.validatePassword(loginDTO.password))) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.getTokenForUser(user);

    return {
      token,
      user: user.toJSON(),
    };
  }

  @Post('/register')
  async register(@Body() registerDTO: RegisterDTO) {
    const existing = await this.userService.findByUsernameOrEmail(
      registerDTO.username,
      registerDTO.email,
    );

    if (existing?.username === registerDTO.username) {
      throw new BadRequestException('username is already taken!');
    }

    if (existing?.email === registerDTO.email) {
      throw new BadRequestException('email is already taken!');
    }

    const user = await this.userService.create(registerDTO);
    const token = await this.authService.getTokenForUser(user);

    return {
      token,
      user: user.toJSON(),
    };
  }
}
