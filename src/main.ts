// 1. 引入nest核心类 NestFactory，用来创建nest应用实例
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// 2.
import { AppModule } from './app.module';
// 3. 定义一个异步启动函数 bootstrap 专门用来启动项目
async function bootstrap() {
  // 4. 调用 NestFactory 类的create 方法创建nest应用实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(3000);
}
// 5. 运行函数启动nest应用
bootstrap();
