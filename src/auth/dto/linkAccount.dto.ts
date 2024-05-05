import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { RegisterDTO } from './register.dto';

export class LinkAccountRequestDTO {
  @IsEmail()
  email: string;
}

export class LinkAccountDTO {
  @IsNotEmpty({ message: 'token must be provided' })
  @IsUUID(4, { message: 'invalid token' })
  token: string;

  data: Omit<RegisterDTO, 'email'>;
}
