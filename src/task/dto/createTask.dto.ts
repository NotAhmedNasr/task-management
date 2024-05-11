import {
  IsDate,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { DateInFutureValidator } from '../utils/validators/futureDate.validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @MinLength(2)
  @MaxLength(300)
  @IsString()
  title: string;

  @MinLength(2)
  @MaxLength(10000)
  @IsString()
  description: string;

  @IsDate()
  @Validate(DateInFutureValidator)
  @Type(() => Date)
  dueAt: Date;
}
