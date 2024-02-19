import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../user/services/user.service';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { RegisterDTO } from '../dto/register.dto';
import { AuthenticatedRequest } from '../types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: AuthenticatedRequest) {
    const token = await this.authService.getTokenForUser(req.user);

    return {
      token,
      user: req.user.toJSON(),
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
    } else if (existing?.email === registerDTO.email) {
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
