import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDTO {
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

  @IsEmail()
  email: string;

  @Length(2, 50)
  @IsAlpha()
  firstName: string;

  @Length(2, 50)
  @IsAlpha()
  lastName: string;
}
