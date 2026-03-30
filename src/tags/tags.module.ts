import { Module } from '@nestjs/common';
import { TagsApiController } from './tags-api.controller';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsApiController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}

