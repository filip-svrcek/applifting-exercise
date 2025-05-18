import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('article/:articleId')
  @ApiOperation({ summary: 'Gets all comments for a specific article' })
  @ApiParam({
    name: 'articleId',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [CommentResponseDto] })
  async findAllForArticle(@Param('articleId') articleId: number) {
    return this.commentsService.findAllForArticle(articleId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creates a new comment to an article' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the created comment',
    type: CommentResponseDto,
  })
  async create(@Body() dto: CreateCommentDto, @Req() req: RequestWithUser) {
    return this.commentsService.create(dto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Updates a comment if created less than a minute ago or had not been deleted',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the comment',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the updated comment',
    type: CommentResponseDto,
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes the original content of a comment' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the comment',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    await this.commentsService.remove(id, req.user.userId);
  }
}
