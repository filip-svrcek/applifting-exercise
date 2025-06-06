import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VoteResponseDto } from './dto/vote-response.dto';
import { isPrismaError } from 'src/common/errors/prisma-error.utils';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVoteDto, ipAddress: string): Promise<CreateVoteResponseDto> {
    try {
      return await this.prisma.vote.create({
        data: {
          commentId: dto.commentId,
          ipAddress,
          isUpvote: dto.isUpvote,
        },
        select: {
          id: true,
          commentId: true,
          ipAddress: true,
          isUpvote: true,
        },
      });
    } catch (error) {
      if (isPrismaError(error) && error.code === 'P2002') {
        throw new ConflictException('This IP has already voted on this comment');
      }
      console.error('Error creating vote:', error);
      throw error;
    }
  }

  async countVotes(commentId: number): Promise<VoteResponseDto> {
    const [upvotes, downvotes] = await Promise.all([
      this.prisma.vote.count({ where: { commentId, isUpvote: true } }),
      this.prisma.vote.count({ where: { commentId, isUpvote: false } }),
    ]);

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    };
  }
}
