// 1. 引入nest核心类 NestFactory，用来创建nest应用实例
import { NestFactory } from '@nestjs/core';
// ts约束
import { NestExpressApplication } from '@nestjs/platform-express';
// 2. 引入应用程序的根模块挂载
import { AppModule } from './app.module';
// 3. 定义一个异步启动函数 bootstrap 专门用来启动项目
async function bootstrap() {
  // 4. 调用 NestFactory 类的create 方法创建nest应用实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(3000);
}
// 5. 运行函数启动nest应用
bootstrap();
