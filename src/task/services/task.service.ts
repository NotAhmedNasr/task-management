import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskAttributes } from '../models/task.model';
import { CreateTaskDto } from '../dto/createTask.dto';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { EditTaskDto } from '../dto/editTask.dto';
import { GetTasksDto } from '../dto/getTasks.dto';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';
import { BoardService } from './board.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    private readonly boardService: BoardService,
  ) {}
  async create(dto: CreateTaskDto, user: UserAttributes) {
    if (
      dto.boardId &&
      !(await this.boardService.isUserAllowed(dto.boardId, user))
    ) {
      throw new NotFoundException(
        "Board doesn't exist or you don't have access",
      );
    }

    const boardId =
      dto.boardId ?? (await this.boardService.getUserPersonalBoard(user)).id;

    return this.taskModel.create({
      title: dto.title,
      description: dto.description,
      dueAt: dto.dueAt,
      createdById: user.id,
      assigneeId: user.id, // for now
      boardId,
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

  async findMany(
    { filter, page = 1, pageSize = 10 }: GetTasksDto,
    user: UserAttributes,
  ) {
    const where: WhereOptions<TaskAttributes> = {};
    where[Op.or] = [
      {
        assigneeId: user.id,
      },
      {
        createdById: user.id,
      },
    ];

    if (filter.title) {
      where.title = {
        [Op.like]: `%${filter.title}%`,
      };
    }

    if (filter.description) {
      where.description = {
        [Op.like]: `%${filter.description}%`,
      };
    }

    if (filter.status) {
      where.status = {
        [Op.eq]: filter.status,
      };
    }

    if (filter.dueAtFrom && filter.dueAtTo) {
      where.dueAt = {
        [Op.gte]: filter.dueAtFrom,
        [Op.lte]: filter.dueAtTo,
      };
    }

    return this.taskModel.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
  }
}
