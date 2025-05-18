import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VoteResponseDto } from './dto/vote-response.dto';
import { getClientIp } from 'src/common/req/get-client-ip';
import { Request } from 'express';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Casts a vote for a comment (up or down)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vote created' })
  async create(@Body() dto: CreateVoteDto, @Req() req: Request & { ip: string }) {
    const ipAddress = getClientIp(req);

    return this.votesService.create({ ...dto, ipAddress });
  }

  @Get('comment/:commentId')
  @ApiOperation({ summary: 'Gets vote counts for a comment' })
  @ApiResponse({ status: HttpStatus.OK, type: VoteResponseDto })
  async countVotes(@Param('commentId') commentId: number) {
    return this.votesService.countVotes(commentId);
  }
}
