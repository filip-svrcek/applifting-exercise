import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class CreateVoteDto {
  @ApiProperty({ example: 1, description: 'Id of the comment' })
  @IsInt()
  @Field()
  commentId: number;

  @ApiProperty({ example: true, description: 'True for upvote, false for downvote' })
  @IsBoolean()
  @Field()
  isUpvote: boolean;
}
