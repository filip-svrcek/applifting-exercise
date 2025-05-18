import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

describe('CommentsController', () => {
  let controller: CommentsController;

  const mockCommentsService = {
    findAllForArticle: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<CommentsController>(CommentsController);

    jest.clearAllMocks();
  });

  describe('findAllForArticle', () => {
    it('should return all comments for an article', async () => {
      const articleId = 1;
      const comments = [{ id: 1, content: 'test comment' }];
      mockCommentsService.findAllForArticle.mockResolvedValue(comments);

      const result = await controller.findAllForArticle(articleId);

      expect(mockCommentsService.findAllForArticle).toHaveBeenCalledWith(articleId);
      expect(result).toBe(comments);
    });
  });

  describe('create', () => {
    it('should create a comment and return it', async () => {
      const dto = { content: 'new comment', articleId: 1 };
      const req = { user: { userId: 123 } } as RequestWithUser;
      const createdComment = { id: 1, ...dto, authorId: 123 };
      mockCommentsService.create.mockResolvedValue(createdComment);

      const result = await controller.create(dto, req);

      expect(mockCommentsService.create).toHaveBeenCalledWith(dto, 123);
      expect(result).toBe(createdComment);
    });
  });

  describe('update', () => {
    it('should update and return the comment', async () => {
      const id = 1;
      const dto = { content: 'updated comment' };
      const req = { user: { userId: 123 } } as RequestWithUser;
      const updatedComment = { id, ...dto, authorId: 123 };
      mockCommentsService.update.mockResolvedValue(updatedComment);

      const result = await controller.update(id, dto, req);
      expect(mockCommentsService.update).toHaveBeenCalledWith(id, dto, 123);
      expect(result).toBe(updatedComment);
    });
  });

  describe('remove', () => {
    it('should call remove and return nothing', async () => {
      const id = 1;
      const req = { user: { userId: 123 } } as RequestWithUser;

      mockCommentsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id, req);

      expect(mockCommentsService.remove).toHaveBeenCalledWith(id, 123);
      expect(result).toBeUndefined();
    });
  });
});
