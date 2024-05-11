import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../models/task.model';
import { CreateTaskDto } from '../dto/createTask.dto';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { EditTaskDto } from '../dto/editTask.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private readonly taskModel: typeof Task) {}
  async create(dto: CreateTaskDto, user: UserAttributes) {
    return this.taskModel.create({
      title: dto.title,
      description: dto.description,
      dueAt: dto.dueAt,
      createdById: user.id,
      assigneeId: user.id, // for now
    });
  }

  async edit(task: Task, dto: EditTaskDto) {
    if (dto.title) {
      task.title = dto.title;
    }
    if (dto.description) {
      task.description = dto.description;
    }
    if (dto.dueAt) {
      task.dueAt = dto.dueAt;
    }

    return task.save();
  }

  async findById(id: string) {
    return this.taskModel.findOne({
      where: {
        id,
      },
    });
  }
}
