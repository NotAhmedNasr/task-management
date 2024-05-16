import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { DateInFutureValidator } from '../utils/validators/futureDate.validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @MinLength(2)
  @MaxLength(100)
  @IsString()
  title: string;

  @MinLength(2)
  @MaxLength(2000)
  @IsString()
  description: string;

  @IsDate()
  @Validate(DateInFutureValidator)
  @Type(() => Date)
  dueAt: Date;

  @IsOptional()
  @IsUUID()
  boardId?: string;
}
