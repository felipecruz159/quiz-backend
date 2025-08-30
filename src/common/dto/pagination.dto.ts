import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number;
}
