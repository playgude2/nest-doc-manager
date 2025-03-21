import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepo: Repository<Document>,
  ) {}

  async create(file: Express.Multer.File, dto: CreateDocumentDto) {
    const doc = this.documentRepo.create({
      ...dto,
      filename: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
    });
    return this.documentRepo.save(doc);
  }

  findAll() {
    return this.documentRepo.find();
  }

  async findOne(id: number) {
    const doc = await this.documentRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async update(id: number, dto: UpdateDocumentDto) {
    const doc = await this.findOne(id);
    Object.assign(doc, dto);
    return this.documentRepo.save(doc);
  }

  async remove(id: number) {
    const doc = await this.findOne(id);
    return this.documentRepo.remove(doc);
  }
}
