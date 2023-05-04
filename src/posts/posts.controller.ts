import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
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
}
