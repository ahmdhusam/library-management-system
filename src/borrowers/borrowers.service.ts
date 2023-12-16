import { Injectable } from '@nestjs/common';
import { Book, User } from '../database/database.service';
import { BorrowersRepository } from './borrowers.repository';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';

@Injectable()
export class BorrowersService {
  constructor(private readonly borrowersRepository: BorrowersRepository) {}

  async getAll(options: PaginationOptions): Promise<User[]> {
    return await this.borrowersRepository.getMany(options);
  }

  async getBorrowerBooks(
    borrowerId: number,
    options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.borrowersRepository.getBorrowerBooks(borrowerId, options);
  }

  async getOverdueBooks(options: PaginationOptions): Promise<Book[]> {
    return await this.borrowersRepository.getOverdueBooks(options);
  }
}
