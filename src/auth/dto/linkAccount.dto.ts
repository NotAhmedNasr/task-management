import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsStrongPassword,
  IsUUID,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LinkAccountRequestDTO {
  @IsEmail()
  email: string;
}

export class LinkAccountData {
  @Matches(/^[a-z].*/, {
    message: 'username must not start with a number',
  })
  @IsLowercase()
  @IsAlphanumeric()
  @Length(2, 50)
  username: string;

  @Length(8, 30)
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}

export class LinkAccountDTO {
  @IsNotEmpty({ message: 'token must be provided' })
  @IsUUID(4, { message: 'invalid token' })
  token: string;

  @ValidateNested()
  @Type(() => LinkAccountData)
  data: LinkAccountData;
}
