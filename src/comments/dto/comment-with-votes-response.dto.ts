import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response.dto';
import { VoteResponseDto } from 'src/votes/dto/vote-response.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentWithVotesResponseDto extends CommentResponseDto {
  @ApiProperty({ type: [VoteResponseDto] })
  @Field(() => VoteResponseDto)
  votes: VoteResponseDto;
}
