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
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/types/request-with-user.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Gets all articles' })
  @ApiResponse({ status: HttpStatus.OK, type: [ArticleResponseDto] })
  async findAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Gets a specific article by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ArticleResponseDto })
  async findOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creates an article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns created article',
    type: ArticleResponseDto,
  })
  async create(@Body() dto: CreateArticleDto, @Req() req: RequestWithUser) {
    return this.articlesService.create(dto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
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
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateArticleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.articlesService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletes an article' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Id of the article',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    await this.articlesService.remove(id, req.user.userId);
  }
}
