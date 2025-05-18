import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockPrisma = {
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService, { provide: PrismaService, useValue: mockPrisma }],
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
          votes: [{ id: 1, isUpvote: false, ipAddress: '192.168.0.1' }],
        },
      ];
      mockPrisma.comment.findMany.mockResolvedValue(comments);

      const result = await service.findAllForArticle(1);
      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
        where: { articleId: 1 },
        orderBy: { createdAt: 'desc' },
        include: {
          votes: true,
        },
      });
      expect(result).toBe(comments);
    });
  });

  describe('create', () => {
    it('should create and return a comment', async () => {
      const dto: CreateCommentDto = { content: 'new comment', articleId: 1 };
      const createdComment = { id: 1, ...dto, authorId: 123 };
      mockPrisma.comment.create.mockResolvedValue(createdComment);

      const result = await service.create(dto, 123);
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          content: dto.content,
          articleId: dto.articleId,
          authorId: 123,
        },
      });
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
      mockPrisma.comment.findUnique.mockResolvedValue(comment);
      mockPrisma.comment.update.mockResolvedValue(updatedComment);

      const result = await service.update(1, dto, 123);
      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { content: dto.content },
      });
      expect(result).toBe(updatedComment);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);
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
      mockPrisma.comment.findUnique.mockResolvedValue(comment);

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
      mockPrisma.comment.findUnique.mockResolvedValue(comment);

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
      mockPrisma.comment.findUnique.mockResolvedValue(comment);
      mockPrisma.comment.update.mockResolvedValue({
        ...comment,
        content: 'This comment has been deleted by the author',
        isDeleted: true,
      });

      await service.remove(1, 123);

      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          content: 'This comment has been deleted by the author',
          isDeleted: true,
        },
      });
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockPrisma.comment.findUnique.mockResolvedValue(null);
      await expect(service.remove(1, 123)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not author', async () => {
      const comment = {
        id: 1,
        content: 'to delete',
        authorId: 999,
        isDeleted: false,
      };
      mockPrisma.comment.findUnique.mockResolvedValue(comment);

      await expect(service.remove(1, 123)).rejects.toThrow(ForbiddenException);
    });
  });
});
