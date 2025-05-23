import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ example: 'Lorem Ipsum', description: 'Title of the article' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    description: 'Lead paragraph of the article',
  })
  @IsNotEmpty()
  @IsString()
  perex: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Aliquam erat volutpat. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Nullam at arcu a est sollicitudin euismod. Etiam quis quam. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Donec vitae arcu. Nunc dapibus tortor vel mi dapibus sollicitudin. Mauris elementum mauris vitae tortor. Morbi scelerisque luctus velit. Maecenas libero. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus.',
    description: 'Content of the article',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
