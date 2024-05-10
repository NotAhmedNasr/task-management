import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class GetHistoryDTO {
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  pageSize: number;
}
