import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import dayjs from 'dayjs';

@ValidatorConstraint({ name: 'future date', async: false })
export class DateInFutureValidator implements ValidatorConstraintInterface {
  validate(date: string): boolean {
    return dayjs().isBefore(dayjs(date));
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be future date`;
  }
}
