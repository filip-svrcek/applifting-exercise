import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  const mockUser = {
    id: 1,
    login: 'testuser',
    password: 'mockedHashedPassword',
  };

  beforeEach(async () => {
    usersService = {
      findUserByLogin: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      jest.spyOn(usersService, 'findUserByLogin').mockResolvedValue(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.SpyInstance).mockResolvedValue(true);

      const result = await authService.validateUser({
        login: 'testuser',
        password: 'validpassword',
      });

      expect(result).toEqual({ id: 1, login: 'testuser' });
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
      (jest.spyOn(bcrypt, 'compare') as jest.SpyInstance).mockResolvedValue(false);

      const result = await authService.validateUser({
        login: 'testuser',
        password: 'wrongpassword',
      });

      expect(result).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should return access token if user is valid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue({ id: 1, login: 'testuser' });

      const result = await authService.authenticate({
        login: 'testuser',
        password: 'validpassword',
      });

      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
      });
    });

    describe('signIn', () => {
      it('should return accessToken and login', () => {
        const result = authService.signIn({ id: 1, login: 'testuser' });

        expect(result).toEqual({
          accessToken: 'mocked-jwt-token',
        });
        expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, login: 'testuser' });
      });
    });

    it('should throw UnauthorizedException if user is invalid', async () => {
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
