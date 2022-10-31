import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
// 通过@Module 装饰器将元数据附加到模块类中 Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  imports: [PostsModule, ArticlesModule, TagsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
// 导出根模块类，它已经经过@Module 装饰器 装饰了。
export class AppModule {}
