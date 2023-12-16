import { ApiResponseProperty } from '@nestjs/swagger';
import { BorrowingProcess } from '@prisma/client';
import { Expose } from 'class-transformer';

export class BorrowingProcessSerialize implements BorrowingProcess {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty()
  @Expose()
  checkoutDate: Date;

  @ApiResponseProperty()
  @Expose()
  returnDate: Date;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;

  @ApiResponseProperty()
  @Expose()
  borrowerId: number;

  @ApiResponseProperty()
  @Expose()
  bookId: number;
}
