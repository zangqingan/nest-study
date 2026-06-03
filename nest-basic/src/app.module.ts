import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './system/user/user.module';
import { AppLoggerMiddleware } from './common/middlewares/app-logger.middleware';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService], //{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
