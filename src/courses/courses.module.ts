import { Module } from '@nestjs/common';
import { CoursesApiController } from './courses-api.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesApiController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

