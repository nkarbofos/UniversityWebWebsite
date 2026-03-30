import { Module } from '@nestjs/common';
import { ReviewsApiController } from './reviews-api.controller';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsApiController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

