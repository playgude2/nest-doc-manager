import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/dto/user-role.enum';
import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ingestion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Trigger ingestion in Python backend' })
  trigger(@Body() dto: TriggerIngestionDto) {
    return this.ingestionService.triggerIngestion(dto);
  }

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiOperation({ summary: 'Check ingestion status (optional stub)' })
  getStatus(@Body('id') id: string) {
    return this.ingestionService.getStatus(id);
  }

  @Get('embedding/:id')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Mock: Get fake embedding for a document' })
getEmbedding(@Param('id') id: string) {
  return {
    docId: id,
    embedding: Array.from({ length: 10 }, () => Math.random().toFixed(3)),
  };
}

}
