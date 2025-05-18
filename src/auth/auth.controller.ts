import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthInput } from './dto/auth-input.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns token' })
  async login(@Body() authInput: AuthInput) {
    return this.authService.authenticate(authInput);
  }
}
