import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class SearchOptionsDto extends PartialType(
  OmitType(CreateBookDto, ['availableQuantity', 'shelfLocation'] as const),
) {}
