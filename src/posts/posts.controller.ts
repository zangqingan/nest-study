import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get('/nihao')
  getHello(): string {
    return '你好';
  }
  // 2. 如何获取get的query参数和parma参数
  @Get('getQueryAndParam/:id?')
  getQuery(
    @Param('id') params: string,
    @Query() query: { value: number; qx: number },
  ): string {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log('params', params);
    console.log('query', query);
    return '2222';
  }
  // 3. 如何获取POST PUT 等请求的Body参数
  @Post('postQuery/:id?')
  postQuery(
    @Param('id') params: string,
    @Body() body: { value: number; qx: number },
  ): string {
    // 实际上你可以直接通过req去拿，当然通过注入也是可以的
    console.log('params', params);
    console.log('body', body);
    return 'PostQuery';
  }
}
