import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LinksModule } from './links/links.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    TagsModule,
    CoursesModule,
    ReviewsModule,
    LinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
