import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class AuthInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  login: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
