import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { Board } from './models/board.model';
import { BoardService } from './services/board.service';
import { EventsService } from './events/event.service';

@Module({
  imports: [SequelizeModule.forFeature([Task, Board])],
  providers: [TaskService, BoardService, EventsService],
  controllers: [TaskController],
})
export class TaskModule {}
