// 1. 引入nest核心类 NestFactory，用来创建nest应用实例
import { NestFactory } from '@nestjs/core';
// 平台ts约束
import { NestExpressApplication } from '@nestjs/platform-express';
// 2. 引入应用程序的根模块挂载
import { AppModule } from './app.module';

/** 其它全局相关的东西 start */
// swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 内置验证管道
import { ValidationPipe } from '@nestjs/common';
// 请求成功返回结果拦截器
import { TransformInterceptor } from './common/interceptors/transform/transform.interceptor';
// 请求错误过滤器
import { HttpExceptionFilter } from './common/filter/http-exception/http-exception.filter';
// 守卫测试
import { TestGuard } from './common/guards/test.guard';

// 使用session + cookie实现登录
import * as session from 'express-session';

/** 其它全局相关的东西 end */

// 3. 定义一个异步启动函数 bootstrap 专门用来引导项目启动
async function bootstrap() {
  // 4. 调用 NestFactory 类的create 方法创建nest应用实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 配置session
  app.use(
    session({
      secret: 'qingan',
      resave: false,
      saveUninitialized: false,
    }),
  );
  // app.setGlobalPrefix('api'); // 设置全局路由前缀
  // 注册全局错误过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 注册全局返回拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局导航守卫
  app.useGlobalGuards(new TestGuard());
  // 全局注册参数验证管道
  app.useGlobalPipes(new ValidationPipe());
  // 配置swagger
  const config = new DocumentBuilder()
    .setTitle('nest学习记录')
    .setDescription('nest学习记录接口文档汇总')
    .setVersion('1.0')
    .addBearerAuth() // 接口增加token认证
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 访问 http://localhost:3000/api-docs#/ 接口查看swagger文档
  SwaggerModule.setup('api-docs', app, document);

  // 启动http服务监听3000端口
  await app.listen(3000);
}

// 5. 运行启动函数开启nest应用
bootstrap();
