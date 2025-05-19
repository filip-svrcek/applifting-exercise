import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  create(dto: CreateArticleDto, authorId: number) {
    return this.prisma.article.create({
      data: {
        ...dto,
        authorId,
      },
    });
  }

  async update(id: number, dto: CreateArticleDto, userId: number) {
    const existing = await this.prisma.article.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    if (existing.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    return this.prisma.article.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: number, userId: number) {
    const article = await this.prisma.article.findUnique({ where: { id } });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    await this.prisma.article.delete({ where: { id } });
  }
}
