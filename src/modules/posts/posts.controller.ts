import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostsService, PostsRo } from './posts.service';
import { CreatePostDto } from './dto/create-posts.dto';
@ApiTags('帖子')
@Controller('posts')
export class PostsController {
  // 初始化服务实例
  constructor(private readonly postsService: PostsService) {}

  // http://localhost:3000/posts/nihao 即可命中路由
  @Get('/nihao')
  getHello(): string {
    return this.postsService.getHello();
  }
  // 2. 如何获取get的query参数和parma参数
  // http://localhost:3000/posts/getQueryAndParam/id 即可命中路由
  @Get('getQueryAndParam/:id?')
  getQuery(
    @Param('id') params: number,
    @Query() query: { value: number; name: string },
  ): object {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    return this.postsService.getQuery(params, query);
  }
  // 3. 如何获取POST PUT 等请求的Body参数
  // http://localhost:3000/posts/postQuery/id 即可命中路由
  @Post('postQuery/:id?')
  postQuery(
    @Param('id') params: number,
    @Body() body: { value: number; name: string },
  ): object {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    return this.postsService.postQuery(params, body);
  }

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @Put('/create')
  async create(@Body() post: CreatePostDto) {
    console.log('post');
    console.log(post);
    return await this.postsService.create(post);
  }

  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取所有文章' })
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    console.log('post');
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '根据文章id获取指定文章' })
  @Get(':id')
  async findById(@Param('id') id) {
    console.log('id', id);
    return await this.postsService.findById(id);
  }

  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '更新文章' })
  @Put(':id')
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @ApiOperation({ summary: '根据文章id删除指定文章' })
  @Delete('id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
