import { Module } from '@nestjs/common';
import { TagsApiController } from './tags-api.controller';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';

@Module({
  controllers: [TagsApiController],
  providers: [TagsService, TagsResolver],
  exports: [TagsService],
})
export class TagsModule {}
