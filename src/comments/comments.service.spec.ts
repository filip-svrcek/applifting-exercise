import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockCommentsRepository = {
    findAllForArticle: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useValue: mockCommentsRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);

    jest.clearAllMocks();
  });

  describe('findAllForArticle', () => {
    it('should return all comments for a given article', async () => {
      const comments = [
        {
          id: 1,
          content: 'test',
          articleId: 1,
          votes: [{ isUpvote: false }, { isUpvote: true }],
        },
      ];
      mockCommentsRepository.findAllForArticle.mockResolvedValue(comments);

      const result = await service.findAllForArticle(1);
      expect(mockCommentsRepository.findAllForArticle).toHaveBeenCalledWith(1);
      expect(result[0].votes.upvotes).toBe(1);
      expect(result[0].votes.downvotes).toBe(1);
      expect(result[0].votes.score).toBe(0);
    });
  });

  describe('create', () => {
    it('should create and return a comment', async () => {
      const dto: CreateCommentDto = { content: 'new comment', articleId: 1 };
      const createdComment = { id: 1, ...dto, authorId: 123 };
      mockCommentsRepository.create.mockResolvedValue(createdComment);

      const result = await service.create(dto, 123);
      expect(mockCommentsRepository.create).toHaveBeenCalledWith(dto, 123);
      expect(result).toBe(createdComment);
    });
  });

  describe('update', () => {
    const dto: UpdateCommentDto = { content: 'updated comment' };

    it('should update and return the comment if conditions met', async () => {
      const comment = {
        id: 1,
        content: 'old',
        authorId: 123,
        createdAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
        isDeleted: false,
      };
      const updatedComment = { ...comment, content: dto.content };
      mockCommentsRepository.findById.mockResolvedValue(comment);
      mockCommentsRepository.update.mockResolvedValue(updatedComment);

      const result = await service.update(1, dto, 123);
      expect(mockCommentsRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCommentsRepository.update).toHaveBeenCalledWith(1, dto.content);
      expect(result).toBe(updatedComment);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentsRepository.findById.mockResolvedValue(null);
      await expect(service.update(1, dto, 123)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const comment = {
        id: 1,
        content: 'old',
        authorId: 999,
        createdAt: new Date(),
        isDeleted: false,
      };
      mockCommentsRepository.findById.mockResolvedValue(comment);

      await expect(service.update(1, dto, 123)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if comment is not editable', async () => {
      const comment = {
        id: 1,
        content: 'old',
        authorId: 123,
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        isDeleted: true,
      };
      mockCommentsRepository.findById.mockResolvedValue(comment);

      await expect(service.update(1, dto, 123)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should mark comment as deleted if user is author', async () => {
      const comment = {
        id: 1,
        content: 'to delete',
        authorId: 123,
        isDeleted: false,
      };
      mockCommentsRepository.findById.mockResolvedValue(comment);
      mockCommentsRepository.softDelete.mockResolvedValue({
        ...comment,
        content: 'This comment has been deleted by the author',
        isDeleted: true,
      });

      await service.remove(1, 123);

      expect(mockCommentsRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCommentsRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentsRepository.findById.mockResolvedValue(null);
      await expect(service.remove(1, 123)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const comment = {
        id: 1,
        content: 'to delete',
        authorId: 999,
        isDeleted: false,
      };
      mockCommentsRepository.findById.mockResolvedValue(comment);

      await expect(service.remove(1, 123)).rejects.toThrow(ForbiddenException);
    });
  });
});
