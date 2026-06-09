import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MyLogger } from './common/logger/myLogger';
// import { CustomWinstonLogger } from './common/logger/customWnston';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('bootstrap error', error);
  }
}
bootstrap();
