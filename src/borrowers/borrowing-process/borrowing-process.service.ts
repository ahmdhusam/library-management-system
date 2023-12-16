import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BorrowingProcessRepository,
  CreateBorrowingProcessInput,
} from './borrowing-process.repository';
import { BorrowingProcess, User } from '../../database/database.service';

@Injectable()
export class BorrowingProcessService {
  constructor(
    private readonly borrowingProcessRepository: BorrowingProcessRepository,
  ) {}

  async create(data: CreateBorrowingProcessInput): Promise<BorrowingProcess> {
    return await this.borrowingProcessRepository.create(data);
  }

  async deleteOneById(user: User, bookId: number): Promise<BorrowingProcess> {
    const borrowingProcess = await this.borrowingProcessRepository.getOne(
      user.id,
      bookId,
    );
    if (!borrowingProcess)
      throw new NotFoundException('Borrowing process is not found');

    return await this.borrowingProcessRepository.deleteOneById(
      borrowingProcess.id,
    );
  }
}
