import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForArticle(articleId: number) {
    return this.prisma.comment.findMany({
      where: {
        articleId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        votes: true,
      },
    });
  }

  async create(dto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: userId,
      },
    });
  }

  async update(id: number, dto: UpdateCommentDto, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
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
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
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
    });
  }
}
