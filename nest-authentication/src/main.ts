import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'zqa', // 签名密钥，请使用环境变量
      resave: false, // 每次请求不强制保存未修改的会话
      saveUninitialized: false, // 不保存空会话
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 小时
        httpOnly: true, // 防止客户端 JS 访问
        secure: false, // 生产环境必须设为 true (HTTPS)
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
