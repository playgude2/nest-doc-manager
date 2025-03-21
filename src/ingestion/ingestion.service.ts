// At the top
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IngestionStatus } from './dto/ingestion-status.enum';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private ingestionStore = new Map<string, IngestionStatus>(); // In-memory tracking

  constructor(private readonly httpService: HttpService) {}

  async triggerIngestion(dto: TriggerIngestionDto) {
    const requestId = uuidv4(); // Generate unique ID for tracking
    this.ingestionStore.set(requestId, IngestionStatus.PROCESSING);

    this.logger.log(`Ingestion started for doc ${dto.documentId} → ID: ${requestId}`);

    // Simulate Python backend with timeout
    setTimeout(() => {
      // Randomly complete or fail ingestion
      const success = Math.random() > 0.2;
      const newStatus = success ? IngestionStatus.COMPLETED : IngestionStatus.FAILED;
      this.ingestionStore.set(requestId, newStatus);
      this.logger.log(`Ingestion ${requestId} completed with status: ${newStatus}`);
    }, 3000); // Simulate 3s processing delay

    return {
      requestId,
      message: 'Ingestion triggered (mocked)',
      status: IngestionStatus.PROCESSING,
    };
  }

  async getStatus(id: string) {
    const status = this.ingestionStore.get(id);
    if (!status) {
      return { requestId: id, status: 'not_found' };
    }
    return { requestId: id, status };
  }
}
