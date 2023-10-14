import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/posts.entity';

// 查询参数接口
interface QueryItf {
  value: number;
  name: string;
}
// 帖子信息接口
export interface PostsRo {
  list: PostsEntity[];
  count: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity) // 注入实体类仓库操作数据库
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  /**
   * 测试路由
   * @returns string
   */
  getHello(): string {
    return 'Hello World! test router';
  }
  getQuery(params: number, query: QueryItf): object {
    return { id: params, value: query.value, name: query.name };
  }
  postQuery(params: number, body: QueryItf): object {
    return { id: params, value: body.value, name: body.name };
  }
  /**
   * 创建文章
   * @param post
   * @returns
   */
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    console.log('post', post);
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.create(post);
  }

  /**
   * 查询所有博客
   * @param query
   * @returns 所有博客列表
   */
  async findAll(query): Promise<PostsRo> {
    const qb = await this.postsRepository.createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  /**
   * 更加id查找指定博客
   * @param id
   * @returns {指定博客对象}
   */
  async findById(id: number): Promise<PostsEntity> {
    return await this.postsRepository.findOne({
      where: { id },
    });
  }

  /**
   * 更新指定博客
   * @param id
   * @param post
   * @returns
   */
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  /**
   * 刪除指定博客
   * @param id
   * @returns
   */
  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}
