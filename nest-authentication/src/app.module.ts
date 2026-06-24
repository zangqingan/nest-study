import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthGuard } from './common/guard/auth.guard';
import { ValidationPipe } from './common/pipe/ValidationPipe.pipe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './system/user/user.module';
import { SysUser } from './system/user/entities/user.entity';
import { AuthModule } from './system/auth/auth.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'wdad',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wanggeng123456',
      database: 'ruoyi_study',
      entities: [SysUser],
      logging: false, // 是否打印对应的sql语句
      autoLoadEntities: true, //自动注册实体，设置为 true 的时候,NestJS 会自动加载数据库实体文件xx.entity.ts文件来创建数据表(如果没有的话)
      synchronize: false, // 是否自动同步实体文件,生产环境建议关闭 - 不同步
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {}
