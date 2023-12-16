import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BookUniqueInput,
  BooksRepositroy,
  CreateBookInput,
} from './books.repository';
import { Book } from '../database/database.service';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepo: BooksRepositroy) {}

  async create(data: CreateBookInput): Promise<Book> {
    return await this.booksRepo.create(data);
  }

  async getOneBy(where: BookUniqueInput): Promise<Book> {
    const book = await this.booksRepo.getOneBy(where);
    if (!book) throw new NotFoundException('The book is not found');

    return book;
  }

  async getAll(options: PaginationOptions): Promise<Book[]> {
    return await this.booksRepo.getMany({}, options);
  }

  async getMany(
    where: BookUniqueInput,
    options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.booksRepo.getMany(where, options);
  }

  async updateOneById(bookId: number, data: CreateBookInput): Promise<Book> {
    const book = await this.getOneBy({ id: bookId });

    return await this.booksRepo.updateOneById(book.id, data);
  }

  async deleteOneById(bookId: number): Promise<Book> {
    const book = await this.getOneBy({ id: bookId });

    return await this.booksRepo.deleteOneById(book.id);
  }
}
