import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
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
