import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthenticatedRequest } from 'src/types';
import { EditUserDto } from '../dto/editUser.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserAttributes } from '../models/userAttributes.model';

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

  @Patch('/me')
  async editOne(@User() user: UserAttributes, @Body() data: EditUserDto) {
    const result = await user.update(data);
    return result.toJSON();
  }
}
