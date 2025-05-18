import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVoteDto {
  @ApiProperty({ example: 1, description: 'ID of the comment' })
  @IsInt()
  commentId: number;

  @ApiProperty({ example: true, description: 'True for upvote, false for downvote' })
  @IsBoolean()
  isUpvote: boolean;
}
