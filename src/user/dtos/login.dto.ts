import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  password: string;
}
