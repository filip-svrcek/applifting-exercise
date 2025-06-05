/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentWithVotesResponseDto } from './dto/comment-with-votes-response.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

describe('CommentsResolver', () => {
  let resolver: CommentsResolver;
  let commentsService: CommentsService;

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsResolver,
        {
          provide: CommentsService,
          useValue: {
            findAllForArticle: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    resolver = module.get<CommentsResolver>(CommentsResolver);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllForArticle', () => {
    it('should return comments for an article', async () => {
      const articleId = 1;
      const comments: CommentWithVotesResponseDto[] = [
        {
          id: 1,
          content: 'Test comment',
          createdAt: new Date(),
          votes: { upvotes: 5, downvotes: 2, score: 3 },
          articleId: 1,
          authorId: 1,
          isDeleted: false,
        },
      ];
      jest.spyOn(commentsService, 'findAllForArticle').mockResolvedValue(comments);

      const result = await resolver.findAllForArticle(articleId);
      expect(result).toEqual(comments);
      expect(commentsService.findAllForArticle).toHaveBeenCalledWith(articleId);
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const dto: CreateCommentDto = { content: 'Hello', articleId: 1 };
      const userId = 2;
      const context = { req: { user: { userId } } } as { req: RequestWithUser };
      const created: CommentResponseDto = {
        id: 1,
        content: 'Hello',
        createdAt: new Date(),
        articleId: 1,
        authorId: 1,
        isDeleted: false,
      };
      jest.spyOn(commentsService, 'create').mockResolvedValue(created);

      const result = await resolver.createComment(dto, context);
      expect(result).toEqual(created);
      expect(commentsService.create).toHaveBeenCalledWith(dto, userId);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const id = 1;
      const dto: UpdateCommentDto = { content: 'Updated' };
      const userId = 3;
      const context = { req: { user: { userId } } } as { req: RequestWithUser };
      const updated: CommentResponseDto = {
        id: 1,
        content: 'Updated',
        createdAt: new Date(),
        articleId: 1,
        authorId: 1,
        isDeleted: false,
      };
      jest.spyOn(commentsService, 'update').mockResolvedValue(updated);

      const result = await resolver.updateComment(id, dto, context);
      expect(result).toEqual(updated);
      expect(commentsService.update).toHaveBeenCalledWith(id, dto, userId);
    });
  });

  describe('removeComment', () => {
    it('should remove a comment', async () => {
      const id = 1;
      const userId = 4;
      const context = { req: { user: { userId } } } as { req: RequestWithUser };
      const removed: CommentResponseDto = {
        id,
        content: 'Removed',
        createdAt: new Date(),
        authorId: userId,
        articleId: 1,
        isDeleted: true,
      };
      jest.spyOn(commentsService, 'remove').mockResolvedValue(removed);

      const result = await resolver.removeComment(id, context);
      expect(result).toEqual(removed);
      expect(commentsService.remove).toHaveBeenCalledWith(id, userId);
    });
  });
});
