import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { VotesRepository } from './votes.repository';
import { ConflictException } from '@nestjs/common';

describe('VotesService', () => {
  let service: VotesService;

  const mockVotesRepository = {
    createVote: jest.fn(),
    countByType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: VotesRepository,
          useValue: mockVotesRepository,
        },
      ],
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
        isUpvote: true,
      };
      const ipAddress = '127.0.0.1';

      const createdVote = { id: 1, ipAddress, ...dto };

      mockVotesRepository.createVote.mockResolvedValue(createdVote);

      const result = await service.create(dto, ipAddress);
      expect(result).toEqual(createdVote);
      expect(mockVotesRepository.createVote).toHaveBeenCalledWith({
        commentId: dto.commentId,
        ipAddress,
        isUpvote: dto.isUpvote,
      });
    });

    it('should throw ConflictException on duplicate vote (P2002)', async () => {
      const dto = {
        commentId: 1,
        isUpvote: true,
      };
      const ipAddress = '127.0.0.1';

      const error = new ConflictException('This IP has already voted on this comment');
      mockVotesRepository.createVote.mockRejectedValue(error);

      await expect(service.create(dto, ipAddress)).rejects.toThrow(ConflictException);
    });

    it('should rethrow unknown errors', async () => {
      const dto = {
        commentId: 1,
        isUpvote: true,
      };
      const ipAddress = '127.0.0.1';

      const error = new Error('Unexpected DB error');
      mockVotesRepository.createVote.mockRejectedValue(error);

      await expect(service.create(dto, ipAddress)).rejects.toThrow('Unexpected DB error');
    });
  });

  describe('countVotes', () => {
    it('should return upvotes, downvotes, and score', async () => {
      mockVotesRepository.countByType
        .mockResolvedValueOnce(3) // upvotes
        .mockResolvedValueOnce(1); // downvotes

      const result = await service.countVotes(1);

      expect(mockVotesRepository.countByType).toHaveBeenCalledWith(1, true);
      expect(mockVotesRepository.countByType).toHaveBeenCalledWith(1, false);

      expect(result).toEqual({
        upvotes: 3,
        downvotes: 1,
        score: 2,
      });
    });
  });
});
