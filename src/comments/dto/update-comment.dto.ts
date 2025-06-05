import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated comment content.',
    description: 'Updated text content of the comment',
  })
  @IsString()
  @Field()
  content: string;
}
