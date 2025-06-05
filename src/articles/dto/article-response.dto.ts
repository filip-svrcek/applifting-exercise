import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class ArticleResponseDto {
  @ApiProperty()
  @Field()
  id: number;

  @ApiProperty({ example: 'Lorem Ipsum', description: 'Title of the article' })
  @Field()
  title: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    description: 'Lead paragraph of the article',
  })
  @Field()
  perex: string;

  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Aliquam erat volutpat. Curabitur ligula sapien, pulvinar a vestibulum quis, facilisis vel sapien. Nullam at arcu a est sollicitudin euismod. Etiam quis quam. Nulla turpis magna, cursus sit amet, suscipit a, interdum id, felis. Donec vitae arcu. Nunc dapibus tortor vel mi dapibus sollicitudin. Mauris elementum mauris vitae tortor. Morbi scelerisque luctus velit. Maecenas libero. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus.',
    description: 'Content of the article',
  })
  @Field()
  content: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Field()
  updatedAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @Field()
  createdAt: Date;
}
