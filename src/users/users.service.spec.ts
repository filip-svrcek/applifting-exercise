import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findUserByLogin', () => {
    it('should call prisma.user.findUnique with correct parameters', async () => {
      const login = 'testUser';
      const mockUser = { id: 1, login: 'testUser' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserByLogin(login);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { login },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
