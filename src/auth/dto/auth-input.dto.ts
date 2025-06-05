import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class AuthInputDto {
  @ApiProperty({ example: 'alice', description: 'The username of the user' })
  @IsNotEmpty()
  @IsString()
  @Field()
  login: string;

  @ApiProperty({ example: 'passworda', description: 'The password of the user' })
  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
