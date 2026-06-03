import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalLogger } from './common/middlewares/logger.middleware';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局日志中间件
  app.use(globalLogger);
  // 全局响应格式化
  app.useGlobalInterceptors(new TransformInterceptor());
  // 开启版本控制
  app.enableVersioning({
    // type: VersioningType.HEADER,
    // header: 'version',
    type: VersioningType.URI,
    // type: VersioningType.MEDIA_TYPE,
    // key: 'vv=', // 指定通
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
