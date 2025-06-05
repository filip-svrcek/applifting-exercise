import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateArticleDto } from './dto/create-article.dto';

@Resolver()
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Query(() => [Article])
  async articles(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Article)
  async createArticle(
    @Args('data') data: CreateArticleDto,
    @Context() context: { req: RequestWithUser },
  ): Promise<Article> {
    const userId = context.req.user.userId;
    return this.articlesService.create(data, userId);
  }
}
