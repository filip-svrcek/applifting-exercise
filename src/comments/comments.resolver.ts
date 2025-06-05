import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentWithVotesResponseDto } from './dto/comment-with-votes-response.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query(() => [CommentWithVotesResponseDto], { name: 'commentsForArticle' })
  async findAllForArticle(
    @Args('articleId', { type: () => Int }) articleId: number,
  ): Promise<CommentWithVotesResponseDto[]> {
    return this.commentsService.findAllForArticle(articleId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentResponseDto)
  async createComment(
    @Args('data') dto: CreateCommentDto,
    @Context() context: { req: RequestWithUser },
  ): Promise<CommentResponseDto> {
    return this.commentsService.create(dto, context.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentResponseDto)
  async updateComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') dto: UpdateCommentDto,
    @Context() context: { req: RequestWithUser },
  ): Promise<CommentResponseDto> {
    return this.commentsService.update(id, dto, context.req.user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CommentResponseDto)
  async removeComment(
    @Args('id', { type: () => Int }) id: number,
    @Context() context: { req: RequestWithUser },
  ): Promise<CommentResponseDto> {
    return this.commentsService.remove(id, context.req.user.userId);
  }
}
