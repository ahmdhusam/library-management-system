import { Test, TestingModule } from '@nestjs/testing';
import { BorrowingProcessController } from './borrowing-process.controller';
import { BorrowingProcessService } from './borrowing-process.service';

describe('BorrowingProcessController', () => {
  let controller: BorrowingProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingProcessController],
      providers: [{ provide: BorrowingProcessService, useValue: {} }],
    }).compile();

    controller = module.get<BorrowingProcessController>(
      BorrowingProcessController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
