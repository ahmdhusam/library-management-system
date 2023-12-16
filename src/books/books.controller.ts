import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book, Roles } from '../database/database.service';
import { BooksSerialize } from './dtos/books.serialize';
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { CreateBookDto } from './dtos/create-book.dto';
import { length } from 'class-validator';
import { PaginationOptions } from '../core/dtos/pagination-options.dto';
import { SearchOptionsDto } from './dtos/search-options.dto';
import { UseRoles } from '../auth/roles/roles.decorator';

@ApiBearerAuth()
@ApiTags('Books')
@ApiUnauthorizedResponse()
@UseSerialize(BooksSerialize)
@Controller('books')
export class BooksController {
  private readonly logger = new Logger(BooksController.name);

  constructor(private readonly booksService: BooksService) {}

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'Add a new book.',
  })
  @ApiConflictResponse({ description: 'ISBN or title is in use' })
  @ApiBadRequestResponse()
  @UseRoles(Roles.ADMIN)
  @Post()
  async create(@Body() data: CreateBookDto): Promise<Book> {
    try {
      return await this.booksService.create(data);
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('ISBN or title is in use');
        default: {
          this.logger.error('create throws: ', err.stack);
          throw new BadRequestException();
        }
      }
    }
  }

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'Search for a book by title, author, or ISBN.',
  })
  @Get('search')
  async search(
    @Query() searchOptions: SearchOptionsDto,
    @Query() options: PaginationOptions,
  ): Promise<Book[]> {
    return await this.booksService.getMany(searchOptions, options);
  }

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'Get a specific book by ISBN.',
  })
  @ApiNotFoundResponse({ description: 'The book is not found' })
  @ApiBadRequestResponse({ description: 'ISBN is not valid' })
  @Get(':isbn')
  async getOneByISBN(@Param('isbn') isbn: string): Promise<Book> {
    if (!length(isbn, 20, 20))
      throw new BadRequestException('ISBN is not valid');

    return await this.booksService.getOneBy({ ISBN: isbn });
  }

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'List all books.',
  })
  @Get()
  async getAll(@Query() options: PaginationOptions): Promise<Book[]> {
    return await this.booksService.getAll(options);
  }

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'Update a specific book by book id.',
  })
  @ApiNotFoundResponse({ description: 'The book is not found' })
  @ApiConflictResponse({ description: 'ISBN or title is in use' })
  @UseRoles(Roles.ADMIN)
  @Patch(':bookId')
  async updateOne(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() data: CreateBookDto,
  ): Promise<Book> {
    try {
      return await this.booksService.updateOneById(bookId, data);
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('ISBN or title is in use');
        default: {
          this.logger.error('updateOne throws: ', err.stack);
          throw err;
        }
      }
    }
  }

  @ApiOkResponse({
    type: BooksSerialize,
    description: 'Delete a specific book by book id',
  })
  @ApiNotFoundResponse({ description: 'The book is not found' })
  @UseRoles(Roles.ADMIN)
  @Delete(':bookId')
  async deleteOne(
    @Param('bookId', ParseIntPipe) bookId: number,
  ): Promise<Book> {
    return await this.booksService.deleteOneById(bookId);
  }
}
