import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  const mockUser = {
    id: 1,
    login: 'testuser',
    password: 'mockedHashedPassword',
  };

  beforeEach(async () => {
    usersService = {
      findUserByLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: usersService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user login if credentials are valid', async () => {
      jest.spyOn(usersService, 'findUserByLogin').mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.SpyInstance).mockResolvedValue(true);

      const result = await authService.validateUser({
        login: 'testuser',
        password: 'validpassword',
      });

      expect(result).toEqual({ login: 'testuser' });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findUserByLogin').mockResolvedValue(null);

      const result = await authService.validateUser({
        login: 'unknown',
        password: 'any',
      });

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      jest.spyOn(usersService, 'findUserByLogin').mockResolvedValue(mockUser);
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      (jest.spyOn(bcrypt, 'compare') as jest.SpyInstance).mockResolvedValue(false);

      const result = await authService.validateUser({
        login: 'testuser',
        password: 'wrongpassword',
      });

      expect(result).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return access token and login if authentication succeeds', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue({ login: 'testuser' });

      const result = await authService.authenticate({
        login: 'testuser',
        password: 'validpassword',
      });

      expect(result).toEqual({
        accessToken: 'fake-jwt-token',
        login: 'testuser',
      });
    });

    it('should throw UnauthorizedException if validation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(
        authService.authenticate({
          login: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
