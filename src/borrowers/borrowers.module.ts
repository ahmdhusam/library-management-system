import { Module } from '@nestjs/common';
import { BorrowersService } from './borrowers.service';
import { BorrowersRepository } from './borrowers.repository';
import { BorrowersController } from './borrowers.controller';
import { BorrowingProcessModule } from './borrowing-process/borrowing-process.module';

@Module({
  controllers: [BorrowersController],
  providers: [BorrowersService, BorrowersRepository],
  imports: [BorrowingProcessModule],
})
export class BorrowersModule {}
