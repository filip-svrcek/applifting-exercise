import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

@InputType()
export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the article the comment is associated with',
  })
  @IsNumber()
  @Field()
  articleId: number;

  @ApiProperty({
    example: 'This is a comment.',
    description: 'Text content of the comment',
  })
  @IsNotEmpty()
  @IsString()
  @Field()
  content: string;
}
