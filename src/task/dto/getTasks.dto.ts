import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TaskStatus } from '../types';
import { Transform, Type, plainToInstance } from 'class-transformer';

class GetTasksFilter {
  @MinLength(2)
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueAtFrom?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueAtTo?: Date;

  @IsUUID()
  @IsOptional()
  boardId?: string;
}

export class GetTasksDto extends PaginationDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => GetTasksFilter)
  @Transform(({ value }) => plainToInstance(GetTasksFilter, JSON.parse(value)))
  filter?: GetTasksFilter;
}
