import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from './articles.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';

describe('ArticlesService', () => {
  let service: ArticlesService;

  const mockArticlesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: ArticlesRepository,
          useValue: mockArticlesRepository,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const articles = [{ id: 1 }, { id: 2 }];
      mockArticlesRepository.findAll.mockResolvedValue(articles);

      const result = await service.findAll();
      expect(result).toBe(articles);
      expect(mockArticlesRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return the article if found', async () => {
      const article = { id: 1 };
      mockArticlesRepository.findById.mockResolvedValue(article);

      const result = await service.findOne(1);
      expect(result).toBe(article);
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticlesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return the article', async () => {
      const dto: CreateArticleDto = {
        title: 'Title',
        perex: 'Leading parahraph',
        content: 'Content',
      };
      const article = { id: 1, createdAt: Date(), updatedAt: Date(), ...dto };
      mockArticlesRepository.create.mockResolvedValue(article);

      const result = await service.create(dto, 123);
      expect(result).toBe(article);
      expect(mockArticlesRepository.create).toHaveBeenCalledWith(dto, 123);
    });
  });

  describe('update', () => {
    it('should update and return the article if user is the author', async () => {
      const dto: CreateArticleDto = {
        title: 'Updated title',
        perex: 'Updated leading parahraph',
        content: 'Updated content',
      };
      const existing = { id: 1, authorId: 123 };
      const updated = dto;

      mockArticlesRepository.findById.mockResolvedValue(existing);
      mockArticlesRepository.update.mockResolvedValue(updated);

      const result = await service.update(1, dto, 123);
      expect(result).toBe(updated);
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticlesRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(
          1,
          {
            title: 'Updated title',
            perex: 'Updated leading parahraph',
            content: 'Updated content',
          },
          123,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const existing = { id: 1, authorId: 456 };
      mockArticlesRepository.findById.mockResolvedValue(existing);

      await expect(
        service.update(
          1,
          {
            title: 'Updated title',
            perex: 'Updated leading parahraph',
            content: 'Updated content',
          },
          123,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete the article if user is the author', async () => {
      const article = { id: 1, authorId: 123 };
      mockArticlesRepository.findById.mockResolvedValue(article);
      mockArticlesRepository.delete.mockResolvedValue(undefined);

      await service.remove(1, 123);
      expect(mockArticlesRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if article not found', async () => {
      mockArticlesRepository.findById.mockResolvedValue(null);

      await expect(service.remove(1, 123)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the author', async () => {
      const article = { id: 1, authorId: 456 };
      mockArticlesRepository.findById.mockResolvedValue(article);

      await expect(service.remove(1, 123)).rejects.toThrow(ForbiddenException);
    });
  });
});
