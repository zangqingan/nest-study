import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CliLoggerMiddleware } from '../../common/middlewares/cli-logger.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CliLoggerMiddleware).forRoutes(UserController);
  }
}
