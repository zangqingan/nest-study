import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
// 引入配置管理模块
// import { ConfigModule } from '@nestjs/config';
// 连接MySQL数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
// 全局中间件
import { TestMiddleware } from './common/middlewares/test.middleware';
// redis
import { createClient } from 'redis';

// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [
    // 注册全局配置模块实现环境配置文件的读取
    // ConfigModule.forRoot(),
    // 使用 TypeORM 配置数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanggeng123456',
      database: 'nest-vue-bms',
      logging: false, // 是否打印对应的sql语句
      autoLoadEntities: true, //自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件,生产环境建议关闭 - 不同步
    }),
    PostsModule,
    TagsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 配置redis
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        return client;
      },
    },
  ],
})
// 导出根模块类，它已经经过@Module 装饰器 装饰了。
export class AppModule implements NestModule {
  // 实现中间件注册
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes('*');
  }
}
