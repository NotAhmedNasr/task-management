import { IsEnum, IsOptional } from 'class-validator';
import { CreateTaskDto } from './createTask.dto';
import { TaskStatus } from '../types';

export class EditTaskDto extends CreateTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  dueAt: Date;

  @IsOptional()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;
}
