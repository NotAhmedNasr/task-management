import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyDTO {
  @IsNotEmpty({ message: 'token must be provided' })
  @IsUUID(4, { message: 'invalid token' })
  token: string;
}
