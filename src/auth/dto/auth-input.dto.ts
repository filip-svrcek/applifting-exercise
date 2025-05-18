import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'alice', description: 'The username of the user' })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password', description: 'The password of the user' })
  password: string;
}
