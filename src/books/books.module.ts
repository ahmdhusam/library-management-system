import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksRepositroy } from './books.repository';

@Module({
  controllers: [BooksController],
  providers: [BooksService, BooksRepositroy],
})
export class BooksModule {}
