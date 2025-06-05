import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Article {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  perex: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
