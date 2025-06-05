import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class VoteResponseDto {
  @ApiProperty({ example: 12, description: 'Total number of upvotes' })
  @Field()
  upvotes: number;

  @ApiProperty({ example: 3, description: 'Total number of downvotes' })
  @Field()
  downvotes: number;

  @ApiProperty({ example: 9, description: 'Total score (upvotes - downvotes)' })
  @Field()
  score: number;
}
