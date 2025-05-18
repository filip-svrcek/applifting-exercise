import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { VoteResponseDto } from './dto/vote-response.dto';
import { Request } from 'express';

describe('VotesController', () => {
  let controller: VotesController;

  const mockVotesService = {
    create: jest.fn(),
    countVotes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
          useValue: mockVotesService,
        },
      ],
    }).compile();

    controller = module.get<VotesController>(VotesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a vote and return result from service', async () => {
      const dto = {
        commentId: 1,
        ipAddress: '192.168.0.1',
        isUpvote: true,
      };

      const createdVote = {
        id: 1,
        ...dto,
      };

      mockVotesService.create.mockResolvedValue(createdVote);
      const req = {
        ip: '192.168.0.1',
        headers: {},
      } as Request & { ip: string };

      const result = await controller.create(dto, req);
      expect(result).toEqual(createdVote);
      expect(mockVotesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('countVotes', () => {
    it('should return upvotes, downvotes, and score', async () => {
      const commentId = 1;
      const voteSummary: VoteResponseDto = {
        upvotes: 5,
        downvotes: 2,
        score: 3,
      };

      mockVotesService.countVotes.mockResolvedValue(voteSummary);

      const result = await controller.countVotes(commentId);
      expect(result).toEqual(voteSummary);
      expect(mockVotesService.countVotes).toHaveBeenCalledWith(commentId);
    });
  });
});
