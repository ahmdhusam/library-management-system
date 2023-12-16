import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';
import { Book, DatabaseService } from '../database/database.service';

export type CreateBookInput = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
export type BookUniqueInput = Partial<
  Pick<Book, 'id' | 'ISBN' | 'title' | 'author'>
>;
export type UpdateUniqueBookInput = Omit<Book, 'author'>;

@Injectable()
export class BooksRepositroy {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(data: CreateBookInput): Promise<Book> {
    return await this.DBContext.book.create({ data });
  }

  async getOneBy(where: BookUniqueInput): Promise<Book> {
    // @ts-expect-error
    return await this.DBContext.book.findUnique({ where });
  }

  async getMany(
    { title = '', author = '', ...rest }: BookUniqueInput,
    options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.DBContext.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: title,
            },
          },
          {
            author: {
              contains: author,
            },
          },
        ],
        ...rest,
      },
      ...options,
    });
  }

  async updateOneById(bookId: number, data: CreateBookInput): Promise<Book> {
    return await this.DBContext.book.update({ where: { id: bookId }, data });
  }

  async deleteOneById(bookId: number): Promise<Book> {
    return await this.DBContext.book.delete({ where: { id: bookId } });
  }
}
