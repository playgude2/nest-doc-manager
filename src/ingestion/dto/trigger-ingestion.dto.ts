import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerIngestionDto {
  @ApiProperty({ example: 'document-id-123' })
  @IsString()
  documentId!: string;
}
