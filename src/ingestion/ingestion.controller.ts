import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Query,
  } from '@nestjs/common';
  import { IngestionService } from './ingestion.service';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { UserRole } from '../users/dto/user-role.enum';
  import { TriggerIngestionDto } from './dto/trigger-ingestion.dto';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  
  @ApiTags('Ingestion')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('ingestion')
  export class IngestionController {
    constructor(private readonly ingestionService: IngestionService) {}
  
    @Post('trigger')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    @ApiOperation({ summary: 'Trigger ingestion in Python backend (mocked)' })
    @ApiBody({
      type: TriggerIngestionDto,
      examples: {
        trigger: {
          summary: 'Trigger with documentId',
          value: {
            documentId: '12345-abcde',
          },
        },
      },
    })
    @ApiResponse({ status: 201, description: 'Ingestion triggered successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden - invalid role' })
    trigger(@Body() dto: TriggerIngestionDto) {
      return this.ingestionService.triggerIngestion(dto);
    }
  
    @Get('status/:id')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    @ApiOperation({ summary: 'Check ingestion status by requestId' })
    @ApiParam({
      name: 'id',
      description: 'UUID returned from /trigger',
      example: 'f85b94a8-9017-4e01-9272-86a914bc99ae',
    })
    @ApiResponse({
      status: 200,
      description: 'Returns current status for the ingestion request',
    })
    getStatus(@Param('id') id: string) {
      return this.ingestionService.getStatus(id);
    }
  
    @Get('embedding/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Mock: Return fake embedding for a document' })
    @ApiParam({
      name: 'id',
      description: 'Document ID to retrieve embedding for',
      example: 'doc-9876',
    })
    @ApiResponse({
      status: 200,
      description: 'Returns a fake embedding (array of numbers)',
    })
    getEmbedding(@Param('id') id: string) {
      return {
        docId: id,
        embedding: Array.from({ length: 10 }, () => Math.random().toFixed(3)),
      };
    }
  }
  