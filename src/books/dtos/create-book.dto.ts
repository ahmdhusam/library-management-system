import {
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Book } from '../../database/database.service';
import { ApiProperty } from '@nestjs/swagger';
import { Transformer } from '../../utils/transformer';

export class CreateBookDto
  implements Omit<Book, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ minLength: 20, maxLength: 20 })
  @Transformer.ToLowerCase()
  @Transformer.Trim()
  @Length(20, 20)
  @IsNumberString()
  ISBN: string;

  @ApiProperty({ minLength: 5, maxLength: 100 })
  @Transformer.ToLowerCase()
  @Transformer.Trim()
  @Length(5, 100)
  @IsString()
  title: string;

  @ApiProperty({ minLength: 5, maxLength: 100 })
  @Transformer.ToLowerCase()
  @Transformer.Trim()
  @Length(5, 100)
  @IsString()
  author: string;

  @ApiProperty({ minimum: 1 })
  @Min(1)
  @IsNumber()
  availableQuantity: number;

  @ApiProperty({ minLength: 5, maxLength: 100 })
  @Transformer.ToLowerCase()
  @Transformer.Trim()
  @Length(5, 100)
  @IsString()
  shelfLocation: string;
}
