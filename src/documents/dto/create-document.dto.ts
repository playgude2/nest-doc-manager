import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Project Proposal' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'First draft of the proposal', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
