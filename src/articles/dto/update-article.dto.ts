import { CreateArticleDto } from './create-article.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto extends CreateArticleDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'Id of the request user' })
  id: number;
}
