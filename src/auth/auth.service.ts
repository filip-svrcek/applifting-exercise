import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthInput = {
  login: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(input: AuthInput) {
    const { login, password } = input;
    const user = await this.usersService.findUserByLogin(login);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { login: user.login };
    }
    return null;
  }

  async authenticate(input: AuthInput) {
    const validatedUser = await this.validateUser(input);
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: 'fake-jwt-token', // TODO: replace with actual JWT token
      login: validatedUser.login,
    };
  }
}
