import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

// 定义jwt 模块方便导入
const jwtModuleA = JwtModule.register({
  secret: 'test123456', // 指定加密 jwt 的密钥
  signOptions: { expiresIn: '4h' }, // 设置过期时间 expiresIn 设置为4小时
});
@Module({
  // 注册实体类
  imports: [TypeOrmModule.forFeature([User]), PassportModule, jwtModuleA],
  controllers: [UserController],
  providers: [UserService],
  exports: [jwtModuleA],
})
export class UserModule {}
