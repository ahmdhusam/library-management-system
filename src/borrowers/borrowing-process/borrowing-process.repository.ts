import { Injectable } from '@nestjs/common';
import {
  BorrowingProcess,
  DatabaseService,
} from '../../database/database.service';
import { PaginationOptions } from '../../core/dtos/pagination-options.dto';

export type CreateBorrowingProcessInput = Pick<
  BorrowingProcess,
  'bookId' | 'borrowerId'
>;

@Injectable()
export class BorrowingProcessRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(data: CreateBorrowingProcessInput): Promise<BorrowingProcess> {
    return await this.DBContext.borrowingProcess.create({ data: { ...data } });
  }

  async getOne(userId: number, bookId: number): Promise<BorrowingProcess> {
    return await this.DBContext.borrowingProcess.findUnique({
      where: {
        borrowerId_bookId: {
          borrowerId: userId,
          bookId,
        },
      },
    });
  }

  async getMany(options: PaginationOptions): Promise<BorrowingProcess[]> {
    return await this.DBContext.borrowingProcess.findMany({ ...options });
  }

  async deleteOneById(borrowingProcessId: number): Promise<BorrowingProcess> {
    return await this.DBContext.borrowingProcess.delete({
      where: { id: borrowingProcessId },
    });
  }
}
