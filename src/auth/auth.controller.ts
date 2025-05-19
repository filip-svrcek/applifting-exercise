import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthInputDto } from './dto/auth-input.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User sign in' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns token', type: AuthResponseDto })
  async login(@Body() authInput: AuthInputDto) {
    return this.authService.authenticate(authInput);
  }
}
