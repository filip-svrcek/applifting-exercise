import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}
