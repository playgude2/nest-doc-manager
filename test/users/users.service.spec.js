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
const users_service_1 = require("../../src/users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../src/users/user.entity");
describe('UsersService', () => {
    let service;
    let repo;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: {
                        find: jest.fn().mockResolvedValue([{ id: 1, email: 'admin@test.com' }]),
                        findOne: jest.fn().mockResolvedValue({ id: 1, email: 'admin@test.com' }),
                        create: jest.fn().mockImplementation(dto => dto),
                        save: jest.fn().mockResolvedValue({ id: 1, email: 'admin@test.com' }),
                        update: jest.fn().mockResolvedValue({ affected: 1 }),
                        delete: jest.fn().mockResolvedValue({ affected: 1 }),
                    },
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repo = module.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.findAll();
        expect(result).toHaveLength(1);
        expect(repo.find).toHaveBeenCalled();
    }));
    it('should return a single user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield service.findOne(1);
        expect(user).toHaveProperty('email', 'admin@test.com');
        expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    }));
    it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = { email: 'test@test.com', password: 'password', role: 'admin' };
        const user = yield service.create(dto);
        expect(user.email).toBe(dto.email);
        expect(repo.create).toHaveBeenCalledWith(dto);
    }));
    it('should update a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.update(1, { email: 'updated@test.com' });
        expect(result).toEqual({ affected: 1 });
    }));
    it('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.remove(1);
        expect(result).toEqual({ affected: 1 });
    }));
});
