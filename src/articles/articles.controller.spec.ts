import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  const mockArticlesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{ provide: ArticlesService, useValue: mockArticlesService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const result = [{ id: 1, title: 'Test Article' }];
      mockArticlesService.findAll.mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const result = { id: 1, title: 'Test Article' };
      mockArticlesService.findOne.mockResolvedValue(result);
      expect(await controller.findOne(1)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return an article', async () => {
      const dto: CreateArticleDto = {
        title: 'New Article',
        perex: 'Leading paragraph',
        content: 'Lorem Ipsum',
      };
      const req = { user: { userId: 123 } } as RequestWithUser;
      const result = { id: 1, ...dto };
      mockArticlesService.create.mockResolvedValue(result);
      expect(await controller.create(dto, req)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return the article', async () => {
      const dto: UpdateArticleDto = {
        id: 1,
        title: 'Updated Title',
        perex: 'Updated Perex',
        content: 'Updated Content',
      };
      const req = { user: { userId: 123 } } as RequestWithUser;
      const result = { ...dto };
      mockArticlesService.update.mockResolvedValue(result);
      expect(await controller.update(1, dto, req)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should call remove method with correct parameters', async () => {
      const req = { user: { userId: 123 } } as RequestWithUser;
      await controller.remove(1, req);
      expect(mockArticlesService.remove).toHaveBeenCalledWith(1, 123);
    });
  });
});
