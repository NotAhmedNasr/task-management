import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateTaskDto } from '../dto/createTask.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { TaskService } from '../services/task.service';
import { EditTaskDto } from '../dto/editTask.dto';
import { GetTasksDto } from '../dto/getTasks.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/')
  async create(@Body() dto: CreateTaskDto, @User() user: UserAttributes) {
    console.log('🚀 ~ TaskController ~ create ~ dto:', typeof dto.dueAt);
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

  @Get('/:id')
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: UserAttributes,
  ) {
    const task = await this.taskService.findById(id);
    if (!task) throw new NotFoundException('task is not found');
    const canView = [task.assigneeId, task.createdById].includes(user.id);
    if (!canView) throw new NotFoundException('task is not found');
    return task;
  }

  @Get('/')
  async getMany(@Query() query: GetTasksDto, @User() user: UserAttributes) {
    const results = await this.taskService.findMany(query, user);

    return {
      data: results.rows,
      meta: {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          total: results.count,
        },
      },
    };
  }
}
