import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalLogger } from './common/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局日志中间件
  app.use(globalLogger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
