import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingProcessService } from './borrowing-process.service';
import { BorrowingProcessRepository } from './borrowing-process.repository';

describe('BorrowingProcessService', () => {
  let service: BorrowingProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowingProcessService,
        { provide: BorrowingProcessRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<BorrowingProcessService>(BorrowingProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
