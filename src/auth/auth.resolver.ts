import { AuthService } from './auth.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthInputDto } from './dto/auth-input.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseDto)
  async login(@Args('data') data: AuthInputDto): Promise<AuthResponseDto> {
    return this.authService.authenticate(data);
  }
}
