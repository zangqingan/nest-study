// 1. 引入nest核心类 NestFactory，用来创建nest应用实例
import { NestFactory } from '@nestjs/core';
// ts约束
import { NestExpressApplication } from '@nestjs/platform-express';
// 2. 引入应用程序的根模块挂载
import { AppModule } from './app.module';

/** 其它全局相关的东西 */
// 管道验证
import { ValidationPipe } from '@nestjs/common';
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 拦截器
// import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
// 全局错误过滤器
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';

// 3. 定义一个异步启动函数 bootstrap 专门用来引导项目启动
async function bootstrap() {
  // 4. 调用 NestFactory 类的create 方法创建nest应用实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setGlobalPrefix('api'); // 设置全局路由前缀
  // 注册全局注册过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器
  // app.useGlobalInterceptors(new TransformInterceptor());
  // swagger
  const config = new DocumentBuilder()
    .setTitle('nest学习记录')
    .setDescription('nest学习记录接口文档汇总')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // 全局注册管道
  app.useGlobalPipes(new ValidationPipe());

  // 启动http服务监听3000端口
  await app.listen(3000);
}

// 5. 运行启动函数开启nest应用
bootstrap();
