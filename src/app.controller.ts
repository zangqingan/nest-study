import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
// @Controller(‘hello’) 当你访问3000/hello的时候你就能 导航 到这个controoler来了
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 使用 @Get @Put @Post @Delete 装饰器来定义HTTP请求类型。如果你给他传递了参数那么这个参数就是它的路径 如下
  // 结合前面的代码，当我们使用get访问 3000/hello/nihao的时候就能得到 “你好” string的返回
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // 可以匹配到 post请求，http://localhost:9080/app/list
  @Post('list')
  create(): string {
    return this.appService.create();
  }

  // 2.通配符路径(?+* 三种通配符 )
  // 可以匹配到 get请求, http://localhost:9080/app/user_xxx
  @Get('user_*')
  getUser() {
    return this.appService.getUser();
  }

  // 3.带参数路径
  // 可以匹配到put请求，http://localhost:9080/app/list/xxxx
  @Put('list/:id')
  update() {
    return this.appService.update();
  }
}
