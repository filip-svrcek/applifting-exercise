import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from './entities/auth.entity';
import { AuthInputDto } from './dto/auth-input.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('data') data: AuthInputDto): Promise<Auth> {
    return this.authService.authenticate(data);
  }
}
