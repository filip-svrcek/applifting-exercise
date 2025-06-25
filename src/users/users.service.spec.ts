import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  const mockUsersRepository = {
    findByLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('findUserByLogin', () => {
    it('should call usersRepository.findByLogin with correct parameters', async () => {
      const login = 'testUser';
      const mockUser = { id: 1, login: 'testUser' };

      mockUsersRepository.findByLogin.mockResolvedValue(mockUser);

      const result = await service.findUserByLogin(login);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersRepository.findByLogin).toHaveBeenCalledWith(login);
      expect(result).toEqual(mockUser);
    });
  });
});
