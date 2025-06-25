import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';

const defaultSelect = {
  id: true,
  title: true,
  perex: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
};

@Injectable()
export class ArticlesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      select: defaultSelect,
    });
  }

  findById(id: number) {
    return this.prisma.article.findUnique({
      where: { id },
      select: defaultSelect,
    });
  }

  create(dto: CreateArticleDto, authorId: number) {
    return this.prisma.article.create({
      data: {
        ...dto,
        authorId,
      },
      select: defaultSelect,
    });
  }

  update(id: number, dto: CreateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: { ...dto },
      select: defaultSelect,
    });
  }

  delete(id: number) {
    return this.prisma.article.delete({ where: { id } });
  }
}
