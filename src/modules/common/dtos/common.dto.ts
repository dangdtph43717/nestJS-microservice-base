import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PagingRequestDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  offset?: number = 0;

  @IsOptional()
  @IsEnum(Sort)
  @ApiPropertyOptional({ enum: Sort, default: Sort.DESC })
  sort?: Sort = Sort.DESC;
}
