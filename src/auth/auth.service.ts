import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthInputDto } from './dto/auth-input.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';
interface SignInData {
  id: number;
  login: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(input: AuthInputDto): Promise<SignInData | null> {
    const { login, password } = input;
    const user = await this.usersService.findUserByLogin(login);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, login: user.login };
    }
    return null;
  }

  signIn(user: SignInData) {
    const tokenPayload: JwtPayload = { sub: user.id, login: user.login };
    const accessToken = this.jwtService.sign(tokenPayload);
    return {
      accessToken,
      login: user.login,
    };
  }

  async authenticate(input: AuthInputDto) {
    const validatedUser = await this.validateUser(input);
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    return this.signIn(validatedUser);
  }
}
