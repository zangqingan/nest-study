import { Controller, Get, Post, Put, Session, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request, Response } from 'express';
// @Controller(‘hello’) 当你访问3000/hello的时候你就能 导航 到这个controoler来了
@ApiTags('公共接口')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 使用 @Get @Put @Post @Delete 装饰器来定义HTTP请求类型。如果你给他传递了参数那么这个参数就是它的路径 如下
  // 结合前面的代码，当我们使用get访问 http://localhost:3000/的时候就能得到 “Hello World!” string的返回
  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
  // 可以匹配到 post请求，http://localhost:3000/list
  @Post('list')
  create(): string {
    return this.appService.create();
  }

  // 2.通配符路径(?+* 三种通配符 )
  // 可以匹配到 get请求, http://localhost:3000/user_xxx 下的所有请求
  @Get('user_*')
  getUser() {
    return this.appService.getUser();
  }

  // 3.带参数路径
  // 可以匹配到put请求，http://localhost:3000/list/xxxx
  @Put('list/:id')
  update() {
    return this.appService.update();
  }

  // 测试session
  @Get('session1')
  getSession1(@Session() session) {
    console.log(session);
    const result = session ? session + 1 : 1;
    return result;
  }
}
