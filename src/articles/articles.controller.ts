import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiOperation({ summary: 'Gets all articles' })
  @ApiResponse({ status: HttpStatus.OK, type: [ArticleResponseDto] })
  @Get()
  async findAll(): Promise<ArticleResponseDto[]> {
    return this.articlesService.findAll();
  }

  @ApiOperation({ summary: 'Gets a specific article by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ArticleResponseDto> {
    return this.articlesService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creates an article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns created article',
    type: ArticleResponseDto,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() dto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.create(dto, req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates an article' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns updated article',
    type: ArticleResponseDto,
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: CreateArticleDto,
    @Req() req: RequestWithUser,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.update(id, dto, req.user.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes an article' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: RequestWithUser): Promise<void> {
    await this.articlesService.remove(id, req.user.userId);
  }
}
