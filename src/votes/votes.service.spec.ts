import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('VotesService', () => {
  let service: VotesService;

  const mockPrisma = {
    vote: {
      create: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a vote', async () => {
      const dto = {
        commentId: 1,
        ipAddress: '127.0.0.1',
        isUpvote: true,
      };

      const createdVote = { id: 1, ...dto };

      mockPrisma.vote.create.mockResolvedValue(createdVote);

      const result = await service.create(dto);
      expect(result).toEqual(createdVote);
      expect(mockPrisma.vote.create).toHaveBeenCalledWith({
        data: dto,
      });
    });

    it('should throw ConflictException on duplicate vote (P2002)', async () => {
      const dto = {
        commentId: 1,
        ipAddress: '127.0.0.1',
        isUpvote: true,
      };

      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '4.0.0',
      });

      mockPrisma.vote.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should rethrow unknown errors', async () => {
      const dto = {
        commentId: 1,
        ipAddress: '127.0.0.1',
        isUpvote: true,
      };

      const error = new Error('Unexpected DB error');
      mockPrisma.vote.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow('Unexpected DB error');
    });
  });

  describe('countVotes', () => {
    it('should return upvotes, downvotes, and score', async () => {
      mockPrisma.vote.count
        .mockResolvedValueOnce(3) // upvotes
        .mockResolvedValueOnce(1); // downvotes

      const result = await service.countVotes(1);

      expect(mockPrisma.vote.count).toHaveBeenCalledWith({
        where: { commentId: 1, isUpvote: true },
      });
      expect(mockPrisma.vote.count).toHaveBeenCalledWith({
        where: { commentId: 1, isUpvote: false },
      });

      expect(result).toEqual({
        upvotes: 3,
        downvotes: 1,
        score: 2,
      });
    });
  });
});
