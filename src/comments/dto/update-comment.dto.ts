import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated comment content.',
    description: 'Updated text content of the comment',
  })
  @IsString()
  content: string;
}
