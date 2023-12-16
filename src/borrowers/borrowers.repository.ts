import { Injectable } from '@nestjs/common';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';
import { Book, DatabaseService, User } from '../database/database.service';

@Injectable()
export class BorrowersRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async getMany(options: PaginationOptions): Promise<User[]> {
    return await this.DBContext.user.findMany({
      where: {
        borrowing: {
          some: {
            checkoutDate: {
              lte: new Date(),
            },
          },
        },
      },
      ...options,
    });
  }

  async getBorrowerBooks(
    borrowerId: number,
    options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.DBContext.book.findMany({
      where: {
        borrowingProcess: {
          some: {
            borrowerId,
          },
        },
      },
      ...options,
    });
  }

  async getOverdueBooks(options: PaginationOptions): Promise<Book[]> {
    return await this.DBContext.book.findMany({
      where: {
        borrowingProcess: {
          some: {
            returnDate: { lt: new Date() },
          },
        },
      },
      ...options,
    });
  }
}
