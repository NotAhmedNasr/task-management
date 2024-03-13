import { IsNotEmpty, IsUUID } from 'class-validator';

export class verifyDTO {
  @IsNotEmpty({ message: 'token must be provided' })
  @IsUUID(4, { message: 'invalid token' })
  token: string;
}
