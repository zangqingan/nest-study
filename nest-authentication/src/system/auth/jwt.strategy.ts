import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from '../../common/constants/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 需要初始化配置所以传入一个配置对象
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 提供从 Request 中提取 JWT 的方法。即指定从 request 的 header 里提取 token, 然后取出 payload 之后会传入 validate 方法做验证, 返回的值同样会设置到 request.user。
      ignoreExpiration: false,
      secretOrKey: 'wdad', //process.env.JWT_SECRET,
    });
  }
  // Passport 首先会验证 JWT 签名并解码 JSON 数据, 随后调用我们的 validate() 方法。
  // 最后 jwt token 验证成功后, Passport 会根据这个方法的返回值构建一个用户对象, 这个对象会挂载在 request.user 属性上。验证不通过报错。
  async validate(payload: any) {
    console.log('JwtStrategy', payload);
    // 可以在这里进行数据库查询以获取更多用户信息
    return { userId: payload.userId, username: payload.userName };
  }
}
