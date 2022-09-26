import { Controller, Get } from '@nestjs/common';
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
}
