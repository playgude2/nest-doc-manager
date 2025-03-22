import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../../src/ingestion/ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingestion } from '../../src/ingestion/ingestion.entity';
import { HttpModule } from '@nestjs/axios';
import { Repository } from 'typeorm';

describe('IngestionService', () => {
  let service: IngestionService;
  let repo: Repository<Ingestion>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Ingestion),
          useValue: {
            create: jest.fn().mockImplementation(dto => ({ ...dto, id: 'uuid' })),
            save: jest.fn().mockResolvedValue({ id: 'uuid', documentId: 'doc-1', status: 'processing' }),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            findOne: jest.fn().mockResolvedValue({ id: 'uuid', status: 'completed' }),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repo = module.get(getRepositoryToken(Ingestion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trigger ingestion and return initial status', async () => {
    const dto = { documentId: 'doc-1' };
    const result = await service.triggerIngestion(dto);
    expect(result).toEqual({
      requestId: 'uuid',
      message: 'Ingestion triggered (persisted)',
      status: 'processing',
    });
  });

  it('should return ingestion status', async () => {
    const result = await service.getStatus('uuid');
    expect(result.status).toBe('completed');
  });

  it('should return not_found if no record', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
    const result = await service.getStatus('missing-id');
    expect(result.status).toBe('not_found');
  });
});
