import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthInputDto } from './dto/auth-input.dto';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            authenticate: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.authenticate and return Auth', async () => {
      const input: AuthInputDto = { login: 'alice', password: 'passworda' };
      const result: Auth = { accessToken: 'token123' };
      jest.spyOn(authService, 'authenticate').mockResolvedValue(result);

      const response = await resolver.login(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.authenticate).toHaveBeenCalledWith(input);
      expect(response).toEqual(result);
    });
  });
});
