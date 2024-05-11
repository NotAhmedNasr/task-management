import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  pageSize?: number;
}
