import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // 默认使用 username 和 password 字段
    // 可以在这里传入自定义名字
    // super({ usernameField: 'email' })
  }
  // 在 @nestjs/passport 中通过 validate() 方法固定实现验证函数,
  // 它会从 request 中取出 body 的 username 和 password 交给我们的 validate 方法去认证,
  // 认证完会返回 user 信息, 放到 request.user 上。
  // 注意：它是 passport-local 策略默认要求请求体包含名为 username 和 password 的属性。
  // Passport 会自动调用此方法, 并将 username 和 password 作为参数传递。
  async validate(username: string, password: string) {
    console.log('LocalStrategy validate', username, password);
    const user = await this.authService.validateUser(username, password);
    return user;
  }
}
