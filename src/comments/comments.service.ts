import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentWithVotesResponseDto } from './dto/comment-with-votes-response.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async findAllForArticle(articleId: number): Promise<CommentWithVotesResponseDto[]> {
    const comments = await this.commentsRepository.findAllForArticle(articleId);

    return comments.map((comment) => ({
      ...comment,
      votes: {
        upvotes: comment.votes.filter((vote) => vote.isUpvote).length,
        downvotes: comment.votes.filter((vote) => !vote.isUpvote).length,
        score:
          comment.votes.filter((vote) => vote.isUpvote).length -
          comment.votes.filter((vote) => !vote.isUpvote).length,
      },
    }));
  }

  async create(dto: CreateCommentDto, userId: number): Promise<CommentResponseDto> {
    return this.commentsRepository.create(dto, userId);
  }

  async update(id: number, dto: UpdateCommentDto, userId: number): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this comment');
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const isEditable = comment.createdAt > oneMinuteAgo && !comment.isDeleted;

    if (!isEditable) {
      throw new ForbiddenException('This comment can no longer be updated');
    }

    return this.commentsRepository.update(id, dto.content);
  }

  async remove(id: number, userId: number): Promise<CommentResponseDto> {
    const comment = await this.commentsRepository.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.commentsRepository.softDelete(id);
  }
}
