import { Module } from '@nestjs/common';
import { LinksApiController } from './links-api.controller';
import { LinksService } from './links.service';

@Module({
  controllers: [LinksApiController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}

