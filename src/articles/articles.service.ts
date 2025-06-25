import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async findAll(): Promise<ArticleResponseDto[]> {
    return this.articlesRepository.findAll();
  }

  async findOne(id: number): Promise<ArticleResponseDto> {
    const article = await this.articlesRepository.findById(id);

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  create(dto: CreateArticleDto, authorId: number): Promise<ArticleResponseDto> {
    return this.articlesRepository.create(dto, authorId);
  }

  async update(id: number, dto: CreateArticleDto, userId: number): Promise<ArticleResponseDto> {
    const existing = await this.articlesRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    if (existing.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    return this.articlesRepository.update(id, dto);
  }

  async remove(id: number, userId: number): Promise<void> {
    const article = await this.articlesRepository.findById(id);

    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    await this.articlesRepository.delete(id);
  }
}
