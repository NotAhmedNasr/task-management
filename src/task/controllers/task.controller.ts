import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTaskDto } from '../dto/createTask.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { TaskService } from '../services/task.service';
import { EditTaskDto } from '../dto/editTask.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  async create(@Body() dto: CreateTaskDto, @User() user: UserAttributes) {
    const task = await this.taskService.create(dto, user);
    return { id: task.id };
  }

  @Patch('/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: EditTaskDto,
    @User() user: UserAttributes,
  ) {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException('task is not found');
    const canEdit = [task.assigneeId, task.createdById].includes(user.id);
    if (!canEdit) throw new ForbiddenException();
    return this.taskService.edit(task, dto);
  }
}
