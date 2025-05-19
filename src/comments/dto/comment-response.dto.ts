import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the comment' })
  id: number;

  @ApiProperty({ example: 'This is a comment.', description: 'Text content of the comment' })
  content: string;

  @ApiProperty({ example: 123, description: 'ID of the user who created the comment' })
  authorId: number;

  @ApiProperty({ example: 1, description: 'ID of the associated article' })
  articleId: number;

  @ApiProperty({ example: '2024-06-01T12:00:00Z', description: 'Date the comment was created' })
  createdAt: Date;

  @ApiProperty({ example: false, description: 'Whether the comment is deleted' })
  isDeleted: boolean;
}
