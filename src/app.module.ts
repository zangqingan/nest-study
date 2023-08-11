import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';
// 连接MySQL数据库
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';

// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanggeng123456',
      database: 'nest-vue-bms',
      autoLoadEntities: true, //自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件,生产环境建议关闭 - 不同步
    }),
    PostsModule,
    TagsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// 导出根模块类，它已经经过@Module 装饰器 装饰了。
export class AppModule {}
