import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 登录校验
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Permission } from './entities/permission.entity';
// 注入策略
import { LocalStrategy } from 'src/common/guards/local.strategy';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';

// 定义 jwt 模块方便注入
const jwtModuleA = JwtModule.register({
  secret: 'test123456', // 指定加密 jwt 的密钥
  signOptions: { expiresIn: '4h' }, // 设置过期时间 expiresIn 设置为4小时
});
@Module({
  // 注册实体类
  imports: [
    TypeOrmModule.forFeature([User, Permission]),
    PassportModule,
    jwtModuleA,
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategy, JwtStrategy],
  exports: [jwtModuleA],
})
export class UserModule {}
