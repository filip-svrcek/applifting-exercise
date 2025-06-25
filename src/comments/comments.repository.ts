import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

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
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllForArticle(articleId: number) {
    return this.prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      select: defaultSelectWithVotes,
    });
  }

  create(dto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: userId,
      },
      select: defaultCommentSelect,
    });
  }

  findById(id: number) {
    return this.prisma.comment.findUnique({
      where: { id },
      select: defaultCommentSelect,
    });
  }

  update(id: number, content: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { content },
      select: defaultCommentSelect,
    });
  }

  softDelete(id: number) {
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
