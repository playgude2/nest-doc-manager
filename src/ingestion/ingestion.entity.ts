import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IngestionStatus } from './dto/ingestion-status.enum';

@Entity()
export class Ingestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  documentId!: string;

  @Column({
    type: 'enum',
    enum: IngestionStatus,
    default: IngestionStatus.PROCESSING,
  })
  status!: IngestionStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
