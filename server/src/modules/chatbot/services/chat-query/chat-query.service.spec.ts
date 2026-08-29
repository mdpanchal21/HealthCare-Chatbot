import { Test, TestingModule } from '@nestjs/testing';
import { ChatQueryService } from './chat-query.service';

describe('ChatQueryService', () => {
  let service: ChatQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatQueryService],
    }).compile();

    service = module.get<ChatQueryService>(ChatQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
