import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AuthInputDto {
  @ApiProperty({ example: 'alice', description: 'The username of the user' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'passworda', description: 'The password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
