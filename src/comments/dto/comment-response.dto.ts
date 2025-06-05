import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the comment' })
  @Field()
  id: number;

  @ApiProperty({ example: 'This is a comment.', description: 'Text content of the comment' })
  @Field()
  content: string;

  @ApiProperty({ example: 123, description: 'ID of the user who created the comment' })
  @Field()
  authorId: number;

  @ApiProperty({ example: 1, description: 'ID of the associated article' })
  @Field()
  articleId: number;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'Date the comment was created' })
  @Field()
  createdAt: Date;

  @ApiProperty({ example: false, description: 'Whether the comment is deleted' })
  @Field()
  isDeleted: boolean;
}
