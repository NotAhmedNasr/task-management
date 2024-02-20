import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedRequest } from 'src/types';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  async findMany() {
    const res = await this.userService.findMany();
    return res;
  }

  @Get('/me')
  findMe(@Request() req: AuthenticatedRequest) {
    return req.user.toJSON();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user.toJSON();
  }
}
