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
  import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
  import * as path from 'path';
  
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
    @ApiConsumes('multipart/form-data')
    create(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateDocumentDto,
    ) {
      return this.documentsService.create(file, dto);
    }
  
    @Get()
    findAll() {
      return this.documentsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.findOne(id);
    }
  
    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateDocumentDto,
    ) {
      return this.documentsService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.documentsService.remove(id);
    }
  }
  