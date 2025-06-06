import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentWithVotesResponseDto } from './dto/comment-with-votes-response.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

const defaultVotesSelect = {
  isUpvote: true,
};

const defaultCommentSelect = {
  id: true,
  content: true,
  createdAt: true,
  articleId: true,
  authorId: true,
  isDeleted: true,
};

const defaultSelectWithVotes = {
  ...defaultCommentSelect,
  votes: {
    select: defaultVotesSelect,
  },
};

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForArticle(articleId: number): Promise<CommentWithVotesResponseDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        articleId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: defaultSelectWithVotes,
    });

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
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: userId,
      },
      select: defaultCommentSelect,
    });
  }

  async update(id: number, dto: UpdateCommentDto, userId: number): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: defaultCommentSelect,
    });

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

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: dto.content,
      },
      select: defaultCommentSelect,
    });
  }

  async remove(id: number, userId: number): Promise<CommentResponseDto> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: 'This comment has been deleted by the author',
        isDeleted: true,
      },
      select: defaultCommentSelect,
    });
  }
}
