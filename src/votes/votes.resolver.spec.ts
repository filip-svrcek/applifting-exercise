/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { VotesResolver } from './votes.resolver';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteResponseDto } from './dto/vote-response.dto';
import { getClientIp } from 'src/common/req/get-client-ip';
import { Request } from 'express';

jest.mock('src/common/req/get-client-ip', () => ({
  getClientIp: jest.fn(),
}));

describe('VotesResolver', () => {
  let resolver: VotesResolver;
  let votesService: VotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesResolver,
        {
          provide: VotesService,
          useValue: {
            create: jest.fn(),
            countVotes: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<VotesResolver>(VotesResolver);
    votesService = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createVote', () => {
    it('should create a vote with client IP', async () => {
      const dto: CreateVoteDto = { commentId: 1, isUpvote: true };
      const ipAddress = '127.0.0.1';
      const context = { req: { ip: ipAddress } } as { req: Request & { ip: string } };
      const response = { id: 1, commentId: 1, isUpvote: true, ipAddress };

      (getClientIp as jest.Mock).mockReturnValue(ipAddress);
      jest.spyOn(votesService, 'create').mockResolvedValue(response);

      const result = await resolver.createVote(dto, context);

      expect(getClientIp).toHaveBeenCalledWith(context.req);
      expect(votesService.create).toHaveBeenCalledWith(dto, ipAddress);
      expect(result).toEqual(response);
    });
  });

  describe('countVotes', () => {
    it('should return vote counts for a comment', async () => {
      const commentId = 1;
      const response: VoteResponseDto = { upvotes: 2, downvotes: 1, score: 1 };
      jest.spyOn(votesService, 'countVotes').mockResolvedValue(response);

      const result = await resolver.countVotes(commentId);

      expect(votesService.countVotes).toHaveBeenCalledWith(commentId);
      expect(result).toEqual(response);
    });
  });
});
