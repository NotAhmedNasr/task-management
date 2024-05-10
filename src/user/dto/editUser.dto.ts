import { Length, IsAlpha, IsOptional } from 'class-validator';

export class EditUserDto {
  @Length(2, 50)
  @IsAlpha()
  @IsOptional()
  firstName: string;

  @Length(2, 50)
  @IsAlpha()
  @IsOptional()
  lastName: string;
}
