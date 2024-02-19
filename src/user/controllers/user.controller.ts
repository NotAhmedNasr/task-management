import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  async findMany() {
    const res = await this.userService.findMany();
    return res;
  }

  @Get('/:id')
  findOne() {
    return this.userService.findById();
  }

  @Get('/me')
  me() {
    return this.userService.findById();
  }
}
