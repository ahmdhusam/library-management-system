import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BorrowingProcessService } from './borrowing-process.service';
import { BorrowingProcess, User } from '../../database/database.service';
import { CurrentUser } from '../../users/users.decorator';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UseSerialize } from '../../core/serialize/serialize.decorator';
import { BorrowingProcessSerialize } from './dtos/borrowing-process.serialize';

@ApiBearerAuth()
@ApiTags('Borrowers Process')
@ApiUnauthorizedResponse()
@UseSerialize(BorrowingProcessSerialize)
@Controller('borrowers/books/')
export class BorrowingProcessController {
  private readonly logger = new Logger(BorrowingProcessController.name);

  constructor(
    private readonly borrowingProcessService: BorrowingProcessService,
  ) {}

  @ApiCreatedResponse({
    type: BorrowingProcessSerialize,
    description: 'A borrower checks out a book.',
  })
  @ApiConflictResponse({ description: 'You already own this book.' })
  @Post(':bookId')
  async checkout(
    @CurrentUser() currentUser: User,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<BorrowingProcess> {
    try {
      return this.borrowingProcessService.create({
        bookId,
        borrowerId: currentUser.id,
      });
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('You already own this book.');
        default: {
          this.logger.error('checkout throws: ', err.stack);
          throw new BadRequestException();
        }
      }
    }
  }

  @ApiOkResponse({
    type: BorrowingProcessSerialize,
    description: 'A borrower returns a book.',
  })
  @ApiNotFoundResponse({ description: 'Borrowing process is not found' })
  @Delete(':bookId')
  async returnBook(
    @CurrentUser() currentUser: User,
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<BorrowingProcess> {
    return await this.borrowingProcessService.deleteOneById(
      currentUser,
      bookId,
    );
  }
}
