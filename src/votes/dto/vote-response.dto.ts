import { ApiProperty } from '@nestjs/swagger';

export class VoteResponseDto {
  @ApiProperty({ example: 12, description: 'Total number of upvotes' })
  upvotes: number;

  @ApiProperty({ example: 3, description: 'Total number of downvotes' })
  downvotes: number;

  @ApiProperty({ example: 9, description: 'Total score (upvotes - downvotes)' })
  score: number;
}
