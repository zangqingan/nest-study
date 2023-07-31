import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { LocalStorage } from '../utils/local.strategy';
import { JwtStorage } from '../utils/jwt.strategy';

const jwtModuleA = JwtModule.register({
  secret: 'test123456',
  signOptions: { expiresIn: '4h' },
});
@Module({
  // 注册实体类
  imports: [TypeOrmModule.forFeature([User]), PassportModule, jwtModuleA],
  controllers: [UserController],
  providers: [UserService, LocalStorage, JwtStorage],
  exports: [jwtModuleA],
})
export class UserModule {}
