import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthInputDto } from './dto/auth-input.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns token' })
  async login(@Body() authInput: AuthInputDto) {
    return this.authService.authenticate(authInput);
  }
}
