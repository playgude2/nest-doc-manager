import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/users/user.entity';
import { UserRole } from '../../src/auth/dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    userRepo = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if user already exists', async () => {
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({ id: 1 } as User);

    await expect(
      service.register({
        email: 'test@test.com',
        password: 'pass',
        role: 'admin' as UserRole,
      }),
    ).rejects.toThrow('User already exists');
  });

  it('should return a token on successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: await bcrypt.hash('Test123', 10),
      role: 'admin' as UserRole,
    };

    jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mock-token');

    const result = await service.login({
      email: mockUser.email,
      password: 'Test123',
    });

    expect(result.access_token).toBe('mock-token');
    expect(result.user.email).toBe(mockUser.email);
  });
});
