import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ArticlesService } from './articles.service';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Resolver()
export class ArticlesResolver {
  constructor(private readonly articlesService: ArticlesService) {}

  @Query(() => [ArticleResponseDto])
  async articles(): Promise<ArticleResponseDto[]> {
    return this.articlesService.findAll();
  }

  @Query(() => ArticleResponseDto)
  async article(@Args('id') id: number): Promise<ArticleResponseDto> {
    return this.articlesService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ArticleResponseDto)
  async createArticle(
    @Args('data') data: CreateArticleDto,
    @Context() context: { req: RequestWithUser },
  ): Promise<ArticleResponseDto> {
    const userId = context.req.user.userId;
    return this.articlesService.create(data, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ArticleResponseDto)
  async updateArticle(
    @Args('id') id: number,
    @Args('data') data: CreateArticleDto,
    @Context() context: { req: RequestWithUser },
  ): Promise<ArticleResponseDto> {
    const userId = context.req.user.userId;
    return this.articlesService.update(id, data, userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ArticleResponseDto)
  async removeArticle(
    @Args('id') id: number,
    @Context() context: { req: RequestWithUser },
  ): Promise<void> {
    const userId = context.req.user.userId;
    await this.articlesService.remove(id, userId);
  }
}
