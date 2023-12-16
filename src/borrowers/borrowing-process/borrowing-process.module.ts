import { Module } from '@nestjs/common';
import { BorrowingProcessController } from './borrowing-process.controller';
import { BorrowingProcessService } from './borrowing-process.service';
import { BorrowingProcessRepository } from './borrowing-process.repository';

@Module({
  controllers: [BorrowingProcessController],
  providers: [BorrowingProcessService, BorrowingProcessRepository],
})
export class BorrowingProcessModule {}
