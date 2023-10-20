import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Tags } from './entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagsDto } from './dto/create-tags.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    // 注入实体
    @InjectRepository(Tags)
    private tagsRepository: Repository<Tags>,
  ) {}

  /**
   * 返回所有标签
   * @returns all tags
   */
  async findAllTags() {
    return await this.tagsRepository.find();
  }

  /**
   *
   * @param id 标签id
   * @returns id对应标签对象
   */
  async findOne(id: number) {
    const tags = await this.tagsRepository.findOne({
      where: { id },
    });
    if (!tags) {
      throw new HttpException('标签不存在', HttpStatus.BAD_REQUEST);
    }
    return tags;
  }

  /**
   *
   * @param createTagsDto 新增标签对象
   * @returns 新增标签对象信息
   */
  async createTags(createTagsDto: UpdateTagsDto) {
    const { name } = createTagsDto;
    // 判断是否已存在用户
    const isExist = await this.tagsRepository.findOne({
      where: { name },
    });
    if (isExist) {
      throw new HttpException('标签名已存在', HttpStatus.BAD_REQUEST);
    }
    try {
      // 创建实体插入对象
      const newTags = await this.tagsRepository.create(createTagsDto);
      // 返回新增的用户对象
      return await this.tagsRepository.save(newTags);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   *
   * @param id 要更新标签id
   * @param updateTagsDto 更新内容
   * @returns 更新后的标签对象
   */
  async updateTags(id: number, updateTagsDto: UpdateTagsDto) {
    const result = await this.tagsRepository.update(id, updateTagsDto);
    return result;
  }

  /**
   *
   * @param id 要删除数据id
   * @returns 删除的对象
   */
  async deleteTags(id: number) {
    const result = await this.tagsRepository.delete(id);
    return result;
  }
}
