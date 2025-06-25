import { Injectable } from '@nestjs/common';
import { VotesRepository } from './votes.repository';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { VoteResponseDto } from './dto/vote-response.dto';
import { AlreadyVotedError } from './errors/already-voted.error';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async create(dto: CreateVoteDto, ipAddress: string): Promise<CreateVoteResponseDto> {
    const hasVoted = await this.votesRepository.hasVoted(dto.commentId, ipAddress);

    if (hasVoted) {
      throw new AlreadyVotedError();
    }

    return this.votesRepository.createVote({
      commentId: dto.commentId,
      ipAddress,
      isUpvote: dto.isUpvote,
    });
  }

  async countVotes(commentId: number): Promise<VoteResponseDto> {
    const [upvotes, downvotes] = await Promise.all([
      this.votesRepository.countByType(commentId, true),
      this.votesRepository.countByType(commentId, false),
    ]);
    return { upvotes, downvotes, score: upvotes - downvotes };
  }
}
