import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthInput } from './dto/auth-input.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authInput: AuthInput) {
    return this.authService.authenticate(authInput);
  }
}
