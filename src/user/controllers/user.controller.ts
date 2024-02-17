import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  findMany() {
    return this.userService.findMany();
  }

  @Get('/:id')
  findOne() {
    return this.userService.findOne();
  }

  @Get('/me')
  me() {
    return this.userService.findOne();
  }
}
