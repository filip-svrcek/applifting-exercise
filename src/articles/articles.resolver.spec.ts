/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesResolver } from './articles.resolver';
import { ArticlesService } from './articles.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';

describe('ArticlesResolver', () => {
  let resolver: ArticlesResolver;
  let articlesService: ArticlesService;

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesResolver,
        {
          provide: ArticlesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    resolver = module.get<ArticlesResolver>(ArticlesResolver);
    articlesService = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('articles', () => {
    it('should return all articles', async () => {
      const articles: ArticleResponseDto[] = [
        {
          id: 1,
          title: 'A',
          perex: 'B',
          content: 'C',
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ];
      jest.spyOn(articlesService, 'findAll').mockResolvedValue(articles);

      const result = await resolver.articles();
      expect(result).toEqual(articles);
      expect(articlesService.findAll).toHaveBeenCalled();
    });
  });

  describe('article', () => {
    it('should return a single article', async () => {
      const article: ArticleResponseDto = {
        id: 1,
        title: 'A',
        perex: 'B',
        content: 'C',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      jest.spyOn(articlesService, 'findOne').mockResolvedValue(article);

      const result = await resolver.article(1);
      expect(result).toEqual(article);
      expect(articlesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('createArticle', () => {
    it('should create an article', async () => {
      const data: CreateArticleDto = { title: 'T', perex: 'P', content: 'C' };
      const userId = 42;
      const created: ArticleResponseDto = {
        id: 1,
        title: 'T',
        perex: 'P',
        content: 'C',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      jest.spyOn(articlesService, 'create').mockResolvedValue(created);

      const context = { req: { user: { userId } } } as { req: RequestWithUser };

      const result = await resolver.createArticle(data, context);
      expect(result).toEqual(created);
      expect(articlesService.create).toHaveBeenCalledWith(data, userId);
    });
  });

  describe('updateArticle', () => {
    it('should update an article', async () => {
      const id = 1;
      const data: CreateArticleDto = { title: 'T', perex: 'P', content: 'C' };
      const userId = 42;
      const updated: ArticleResponseDto = {
        id,
        title: 'T',
        perex: 'P',
        content: 'C',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      jest.spyOn(articlesService, 'update').mockResolvedValue(updated);

      const context = { req: { user: { userId } } } as { req: RequestWithUser };

      const result = await resolver.updateArticle(id, data, context);
      expect(result).toEqual(updated);
      expect(articlesService.update).toHaveBeenCalledWith(id, data, userId);
    });
  });

  describe('removeArticle', () => {
    it('should remove an article', async () => {
      const id = 1;
      const userId = 42;
      jest.spyOn(articlesService, 'remove').mockResolvedValue(undefined);

      const context = { req: { user: { userId } } } as { req: RequestWithUser };

      await expect(resolver.removeArticle(id, context)).resolves.toBeUndefined();
      expect(articlesService.remove).toHaveBeenCalledWith(id, userId);
    });
  });
});
