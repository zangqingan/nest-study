import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';

@ApiTags('标签')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  /**
   * 获取所有标签
   */
  @ApiOperation({ summary: '获取所有标签' })
  @Get()
  getAllTags() {
    return this.tagsService.findAllTags();
  }

  /**
   * 获取指定id标签
   * @param id 标签id
   * @returns id对应标签对象内容
   */
  @ApiOperation({ summary: '获取指定id标签' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  /**
   *
   * @param createTagsDto 创建标签对象
   * @returns 新创建的标签对象
   */
  @ApiOperation({ summary: '新建标签' })
  @Post('create')
  createTags(@Body() createTagsDto: CreateTagsDto) {
    return this.tagsService.createTags(createTagsDto);
  }

  /**
   *
   * @param id 更新标签id
   * @param updateTagsDto 更新内容
   * @returns 返回更新后的标签对象
   */
  @ApiOperation({ summary: '更新标签' })
  @Patch('update/:id')
  updateTags(@Param('id') id, @Body() updateTagsDto: UpdateTagsDto) {
    return this.tagsService.updateTags(+id, updateTagsDto);
  }

  /**
   *
   * @param id 删除标签id
   * @returns 删除的标签对象
   */
  @ApiOperation({ summary: '删除标签' })
  @Delete('delete/:id')
  deleteTags(@Param('id') id: string) {
    return this.tagsService.deleteTags(+id);
  }
}
