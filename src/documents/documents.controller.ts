import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { DocumentsService } from './documents.service';
  import { CreateDocumentDto } from './dto/create-document.dto';
  import { UpdateDocumentDto } from './dto/update-document.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { UserRole } from '../users/dto/user-role.enum';
  import {
    ApiBearerAuth,
    ApiConsumes,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger';
  
  @ApiTags('Documents')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Controller('documents')
  export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}
  
    @Post()
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
      }),
    )
    @ApiOperation({ summary: 'Upload a document', description: 'Allows admin or editor to upload a document with title/description.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Document upload payload',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          title: {
            type: 'string',
            example: 'Sample Document',
          },
          description: {
            type: 'string',
            example: 'Optional description of the document.',
          },
        },
        required: ['file', 'title'],
      },
    })
    @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
    create(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateDocumentDto,
    ) {
      return this.documentsService.create(file, dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all documents' })
    @ApiResponse({ status: 200, description: 'List of all documents' })
    findAll() {
      return this.documentsService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get document by ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Document found' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    @ApiOperation({ summary: 'Update document metadata' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiBody({
      type: UpdateDocumentDto,
      examples: {
        updateTitle: {
          summary: 'Update title only',
          value: { title: 'Updated Title' },
        },
        updateAll: {
          summary: 'Update title and description',
          value: {
            title: 'New Project Plan',
            description: 'Latest updated version',
          },
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Document updated' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateDocumentDto,
    ) {
      return this.documentsService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete document by ID' })
    @ApiParam({ name: 'id', type: 'number' })
    @ApiResponse({ status: 200, description: 'Document deleted' })
    @ApiResponse({ status: 404, description: 'Document not found' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.remove(id);
    }
  }
  