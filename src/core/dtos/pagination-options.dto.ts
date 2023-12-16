import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Transformer } from '../../utils/transformer';

export class PaginationOptions {
  @ApiProperty({ required: false })
  @Max(50)
  @IsPositive()
  @IsInt()
  @IsNumber()
  @Transformer.ParseNumber()
  @IsOptional()
  take: number = 20;

  @ApiProperty({ required: false })
  @Min(0)
  @IsInt()
  @IsNumber()
  @Transformer.ParseNumber()
  @IsOptional()
  skip: number = 0;
}
