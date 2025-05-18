import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the article the comment is associated with',
  })
  @IsNumber()
  articleId: number;

  @ApiProperty({
    example: 'This is a comment.',
    description: 'Text content of the comment',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
