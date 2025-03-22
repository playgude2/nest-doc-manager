"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ingestion_service_1 = require("../../src/ingestion/ingestion.service");
const typeorm_1 = require("@nestjs/typeorm");
const ingestion_entity_1 = require("../../src/ingestion/ingestion.entity");
const axios_1 = require("@nestjs/axios");
describe('IngestionService', () => {
    let service;
    let repo;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            imports: [axios_1.HttpModule],
            providers: [
                ingestion_service_1.IngestionService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(ingestion_entity_1.Ingestion),
                    useValue: {
                        create: jest.fn().mockImplementation(dto => (Object.assign(Object.assign({}, dto), { id: 'uuid' }))),
                        save: jest.fn().mockResolvedValue({ id: 'uuid', documentId: 'doc-1', status: 'processing' }),
                        update: jest.fn().mockResolvedValue({ affected: 1 }),
                        findOne: jest.fn().mockResolvedValue({ id: 'uuid', status: 'completed' }),
                    },
                },
            ],
        }).compile();
        service = module.get(ingestion_service_1.IngestionService);
        repo = module.get((0, typeorm_1.getRepositoryToken)(ingestion_entity_1.Ingestion));
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should trigger ingestion and return initial status', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = { documentId: 'doc-1' };
        const result = yield service.triggerIngestion(dto);
        expect(result).toEqual({
            requestId: 'uuid',
            message: 'Ingestion triggered (persisted)',
            status: 'processing',
        });
    }));
    it('should return ingestion status', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getStatus('uuid');
        expect(result.status).toBe('completed');
    }));
    it('should return not_found if no record', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null);
        const result = yield service.getStatus('missing-id');
        expect(result.status).toBe('not_found');
    }));
});
