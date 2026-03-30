import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import type { Response } from 'express';
import { buildPaginationLinks } from '../common/pagination/pagination';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

class TagsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 50;
}

@ApiTags('tags')
@Controller('api/tags')
export class TagsApiController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'List tags (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiResponse({ status: 200 })
  @Get()
  async findAll(@Query() query: TagsQueryDto, @Res({ passthrough: true }) res: Response) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;

    const { items, hasNext } = await this.tagsService.findAll({ page, pageSize });
    const link = buildPaginationLinks({
      baseUrl: '/api/tags',
      page,
      pageSize,
      hasNext,
    });
    if (link) res.setHeader('Link', link);
    return items;
  }

  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: 201 })
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @ApiOperation({ summary: 'Get tag by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update tag by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete tag by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagsService.remove(id);
  }
}

