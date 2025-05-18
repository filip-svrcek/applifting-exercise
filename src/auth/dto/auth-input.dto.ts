import { IsString, IsNotEmpty } from 'class-validator';

export class AuthInput {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
