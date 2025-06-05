import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthInput } from './dto/graphql/auth.input';
import { Auth } from './entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('data') data: AuthInput): Promise<Auth> {
    return this.authService.authenticate(data);
  }
}
