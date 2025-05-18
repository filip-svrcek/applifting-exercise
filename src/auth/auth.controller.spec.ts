import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth-input.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    authenticate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.authenticate with correct parameters and return its result', async () => {
      const authInput: AuthInput = { login: 'testuser', password: 'testpass' };
      const expectedResult = { accessToken: 'mock_token' };

      mockAuthService.authenticate.mockResolvedValue(expectedResult);

      const result = await authController.login(authInput);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.authenticate).toHaveBeenCalledWith(authInput);
      expect(result).toEqual(expectedResult);
    });
  });
});
