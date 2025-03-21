import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  getStatus() {
    return this.ingestionService.getStatus();
  }
}
