import { Resolver, Mutation, Args, Query, Int, Context } from '@nestjs/graphql';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { VoteResponseDto } from './dto/vote-response.dto';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { getClientIp } from 'src/common/req/get-client-ip';
import { Request } from 'express';

@Resolver()
export class VotesResolver {
  constructor(private readonly votesService: VotesService) {}

  @Mutation(() => CreateVoteResponseDto)
  async createVote(
    @Args('data') dto: CreateVoteDto,
    @Context() context: { req: Request & { ip: string } },
  ): Promise<CreateVoteResponseDto> {
    const ipAddress = getClientIp(context.req);
    return this.votesService.create(dto, ipAddress);
  }

  @Query(() => VoteResponseDto)
  async countVotes(
    @Args('commentId', { type: () => Int }) commentId: number,
  ): Promise<VoteResponseDto> {
    return this.votesService.countVotes(commentId);
  }
}
