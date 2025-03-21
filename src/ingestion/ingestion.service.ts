import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private readonly httpService: HttpService) {}

  async triggerIngestion(dto: TriggerIngestionDto) {
    const ingestionUrl = 'http://localhost:5000/ingest'; // Python service URL

    try {
      const response = await firstValueFrom(
        this.httpService.post(ingestionUrl, { documentId: dto.documentId }),
      );

      return {
        message: 'Ingestion triggered successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error('Failed to trigger ingestion', error);
      return {
        message: 'Failed to trigger ingestion',
        error: error?.message,
      };
    }
  }

  getStatus() {
    // Optional: Could return in-memory status or ping the Python service
    return { status: 'Ingestion tracking not implemented yet' };
  }
}
