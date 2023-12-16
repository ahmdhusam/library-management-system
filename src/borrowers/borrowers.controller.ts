import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Book, User } from '../database/database.service';
import { UseRoles } from '../auth/roles/roles.decorator';
import { Roles } from '../auth/roles/roles.enum';
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { UsersSerialize } from '../users/dtos';
import { BorrowersService } from './borrowers.service';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';
import { BooksSerialize } from '../books/dtos/books.serialize';
import { UseSkipRoles } from '../auth/roles/roles.guard';
import { CurrentUser } from '../users/users.decorator';

@ApiBearerAuth()
@ApiTags('Borrowers')
@ApiUnauthorizedResponse()
@UseRoles(Roles.ADMIN)
@Controller('borrowers')
export class BorrowersController {
  constructor(private readonly borrowersService: BorrowersService) {}

  @ApiOkResponse({
    description: 'List all borrowers.',
    type: UsersSerialize,
  })
  @UseSerialize(UsersSerialize)
  @Get()
  async getAll(@Query() options: PaginationOptions): Promise<User[]> {
    return await this.borrowersService.getAll(options);
  }

  @ApiOkResponse({
    description: 'A borrower checks the books they currently have.',
    type: BooksSerialize,
  })
  @UseSerialize(BooksSerialize)
  @UseSkipRoles()
  @Get('books')
  async getOwnBooks(
    @CurrentUser() currentUser: User,
    @Query() options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.borrowersService.getBorrowerBooks(
      currentUser.id,
      options,
    );
  }

  @ApiOkResponse({
    description: 'List books that are overdue.',
    type: BooksSerialize,
  })
  @UseSerialize(BooksSerialize)
  @Get('books/overdue')
  async getOverdueBooks(@Query() options: PaginationOptions): Promise<Book[]> {
    return await this.borrowersService.getOverdueBooks(options);
  }

  @ApiOkResponse({
    description: 'Checks the books the borrower currently have.',
    type: BooksSerialize,
  })
  @UseSerialize(BooksSerialize)
  @Get(':userId/books')
  async getBorrowerBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.borrowersService.getBorrowerBooks(userId, options);
  }
}
