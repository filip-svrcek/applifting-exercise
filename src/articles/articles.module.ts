import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArticlesResolver } from './articles.resolver';

@Module({
  imports: [AuthModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesResolver],
})
export class ArticlesModule {}
