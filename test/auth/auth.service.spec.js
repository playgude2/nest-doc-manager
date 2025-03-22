"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const auth_service_1 = require("../../src/auth/auth.service");
const user_entity_1 = require("../../src/users/user.entity");
describe('AuthService', () => {
    let service;
    let userRepo;
    let jwtService;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const moduleRef = yield testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                jwt_1.JwtService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(user_entity_1.User),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = moduleRef.get(auth_service_1.AuthService);
        userRepo = moduleRef.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        jwtService = moduleRef.get(jwt_1.JwtService);
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should throw if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({ id: 1 });
        yield expect(service.register({
            email: 'test@test.com',
            password: 'pass',
            role: 'admin',
        })).rejects.toThrow('User already exists');
    }));
    it('should return a token on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUser = {
            id: 1,
            email: 'test@test.com',
            password: yield bcrypt.hash('Test123', 10),
            role: 'admin',
        };
        jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');
        const result = yield service.login({
            email: mockUser.email,
            password: 'Test123',
        });
        expect(result.access_token).toBe('mock-token');
        expect(result.user.email).toBe(mockUser.email);
    }));
});
