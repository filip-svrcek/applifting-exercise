import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response.dto';
import { VoteResponseDto } from 'src/votes/dto/vote-response.dto';

export class CommentWithVotesResponseDto extends CommentResponseDto {
  @ApiProperty({ type: [VoteResponseDto] })
  votes: VoteResponseDto;
}
