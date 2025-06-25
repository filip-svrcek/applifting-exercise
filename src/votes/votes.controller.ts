import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Req,
  UseFilters,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { VoteResponseDto } from './dto/vote-response.dto';
import { getClientIp } from 'src/common/req/get-client-ip';
import { Request } from 'express';
import { CreateVoteResponseDto } from './dto/create-vote-response.dto';
import { AlreadyVotedFilter } from './filters/already-voted.filter';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @ApiOperation({ summary: 'Casts a vote for a comment (up or down)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Vote created' })
  @UseFilters(AlreadyVotedFilter)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() dto: CreateVoteDto,
    @Req() req: Request & { ip: string },
  ): Promise<CreateVoteResponseDto> {
    const ipAddress = getClientIp(req);

    return this.votesService.create(dto, ipAddress);
  }

  @ApiOperation({ summary: 'Gets vote counts for a comment' })
  @ApiParam({
    name: 'commentId',
    type: Number,
    example: 1,
    description: 'Id of the comment',
  })
  @ApiResponse({ status: HttpStatus.OK, type: VoteResponseDto })
  @Get('comment/:commentId')
  async countVotes(@Param('commentId') commentId: number): Promise<VoteResponseDto> {
    return this.votesService.countVotes(commentId);
  }
}
