/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesResolver } from './articles.resolver';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

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
            create: jest.fn(),
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
      const articles = [
        {
          id: 1,
          title: 'A',
          perex: 'B',
          content: 'C',
          updatedAt: new Date(),
          createdAt: new Date(),
          authorId: 1,
        },
      ];
      jest.spyOn(articlesService, 'findAll').mockResolvedValue(articles);

      const result = await resolver.articles();
      expect(result).toEqual(articles);
      expect(articlesService.findAll).toHaveBeenCalled();
    });
  });

  describe('createArticle', () => {
    it('should create an article with userId from context', async () => {
      const data: CreateArticleDto = { title: 'T', perex: 'P', content: 'C' };
      const userId = 42;
      const created = {
        id: 1,
        title: 'T',
        perex: 'P',
        content: 'C',
        updatedAt: new Date(),
        createdAt: new Date(),
        authorId: userId,
      };
      jest.spyOn(articlesService, 'create').mockResolvedValue(created);

      const context = { req: { user: { userId, login: 'alice' } } } as unknown as {
        req: RequestWithUser;
      };

      const result = await resolver.createArticle(data, context);
      expect(result).toEqual(created);
      expect(articlesService.create).toHaveBeenCalledWith(data, userId);
    });
  });
});
