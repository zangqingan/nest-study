import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
// import { MyLogger } from './common/logger/myLogger';
// import { CustomWinstonLogger } from './common/logger/customWnston';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    await app.listen(port);
    console.log(`Application is running on: ${port}`);
  } catch (error) {
    console.error('bootstrap error', error);
  }
}
bootstrap();
