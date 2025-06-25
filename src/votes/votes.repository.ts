import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createVote(data: { commentId: number; ipAddress: string; isUpvote: boolean }) {
    return this.prisma.vote.create({
      data,
      select: {
        id: true,
        commentId: true,
        ipAddress: true,
        isUpvote: true,
      },
    });
  }

  async countByType(commentId: number, isUpvote: boolean) {
    return this.prisma.vote.count({ where: { commentId, isUpvote } });
  }

  async hasVoted(commentId: number, ipAddress: string) {
    const vote = await this.prisma.vote.findFirst({
      where: { commentId, ipAddress },
      select: { id: true },
    });
    return !!vote;
  }
}
