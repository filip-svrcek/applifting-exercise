/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { VotesGateway } from './votes.gateway';
import { VotesService } from 'src/votes/votes.service';
import { AuthService } from 'src/auth/auth.service';
import { WsException } from '@nestjs/websockets';
import { validateOrReject } from 'class-validator';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validateOrReject: jest.fn(),
}));

describe('VotesGateway', () => {
  let gateway: VotesGateway;
  let votesService: VotesService;
  let authService: AuthService;

  const mockClient: any = {
    id: 'socket123',
    handshake: {
      query: { token: 'valid-token' },
      headers: { 'x-forwarded-for': '127.0.0.1' },
      address: '127.0.0.1',
    },
    disconnect: jest.fn(),
  };

  const mockVoteDto = {
    commentId: 1,
    isUpvote: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesGateway,
        {
          provide: VotesService,
          useValue: {
            create: jest.fn().mockResolvedValue({ commentId: 1, isUpvote: true }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();
    (validateOrReject as jest.Mock).mockResolvedValue(undefined);
    gateway = module.get<VotesGateway>(VotesGateway);
    votesService = module.get<VotesService>(VotesService);
    authService = module.get<AuthService>(AuthService);
    gateway.server = { emit: jest.fn() } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should connect successfully with valid token', () => {
      expect(() => gateway.handleConnection(mockClient)).not.toThrow();
      expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should disconnect client if no token provided', () => {
      mockClient.handshake.query.token = undefined;

      expect(() => gateway.handleConnection(mockClient)).toThrow(WsException);
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should disconnect client if token is invalid', () => {
      (authService.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid');
      });

      expect(() => gateway.handleConnection(mockClient)).toThrow(WsException);
      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect', () => {
    it('should log disconnect', () => {
      console.log = jest.fn();
      gateway.handleDisconnect(mockClient);
      expect(console.log).toHaveBeenCalledWith('Client disconnected:', 'socket123');
    });
  });

  describe('handleVoteComment', () => {
    it('should emit commentVoted event on success', async () => {
      (validateOrReject as jest.Mock).mockResolvedValue(undefined);

      await gateway.handleVoteComment(mockVoteDto, mockClient);

      expect(votesService.create).toHaveBeenCalledWith(mockVoteDto, '127.0.0.1');
      expect(gateway.server.emit).toHaveBeenCalledWith('commentVoted', {
        commentId: 1,
        isUpvote: true,
      });
    });

    it('should throw WsException on validation failure', async () => {
      (validateOrReject as jest.Mock).mockRejectedValue(new Error('Validation failed'));

      await expect(gateway.handleVoteComment(mockVoteDto, mockClient)).rejects.toThrow(WsException);
    });

    it('should throw WsException on vote creation error', async () => {
      (validateOrReject as jest.Mock).mockResolvedValue(undefined);
      (votesService.create as jest.Mock).mockRejectedValue(new Error('Voting error'));

      await expect(gateway.handleVoteComment(mockVoteDto, mockClient)).rejects.toThrow(
        new WsException('You cannot vote for this comment'),
      );
    });
  });
});
