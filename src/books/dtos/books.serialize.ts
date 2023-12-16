import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Book } from '../../database/database.service';

export class BooksSerialize implements Book {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty()
  @Expose()
  ISBN: string;

  @ApiResponseProperty()
  @Expose()
  title: string;

  @ApiResponseProperty()
  @Expose()
  author: string;

  @ApiResponseProperty()
  @Expose()
  availableQuantity: number;

  @ApiResponseProperty()
  @Expose()
  shelfLocation: string;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;
}
