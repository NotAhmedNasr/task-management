import {
  IsDateString,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { DateInFutureValidator } from '../utils/validators/futureDate.validator';

export class CreateTaskDto {
  @MinLength(2)
  @MaxLength(300)
  @IsString()
  title: string;

  @MinLength(2)
  @MaxLength(10000)
  @IsString()
  description: string;

  @Validate(DateInFutureValidator)
  @IsDateString()
  dueAt: Date;
}
