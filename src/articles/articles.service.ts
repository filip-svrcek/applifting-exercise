import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

const defaultSelect = {
  id: true,
  title: true,
  perex: true,
  content: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ArticleResponseDto[]> {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: defaultSelect,
    });
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: defaultSelect,
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  create(dto: CreateArticleDto, authorId: number): Promise<ArticleResponseDto> {
    return this.prisma.article.create({
      data: {
        ...dto,
        authorId,
      },
      select: defaultSelect,
    });
  }

  async update(id: number, dto: CreateArticleDto, userId: number): Promise<ArticleResponseDto> {
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
      select: defaultSelect,
    });
  }

  async remove(id: number, userId: number): Promise<void> {
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
