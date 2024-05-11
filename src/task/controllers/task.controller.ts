import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTaskDto } from '../dto/createTask.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { TaskService } from '../services/task.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  async create(@Body() dto: CreateTaskDto, @User() user: UserAttributes) {
    const task = await this.taskService.create(dto, user);
    return { id: task.id };
  }
}
