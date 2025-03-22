import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
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

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const user = await service.findOne(1);
    expect(user).toHaveProperty('email', 'admin@test.com');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a user', async () => {
    const dto = { email: 'test@test.com', password: 'password', role: 'admin' };
    const user = await service.create(dto as any);
    expect(user.email).toBe(dto.email);
    expect(repo.create).toHaveBeenCalledWith(dto);
  });

  it('should update a user', async () => {
    const result = await service.update(1, { email: 'updated@test.com' });
    expect(result).toEqual({ affected: 1 });
  });

  it('should delete a user', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
  });
});
