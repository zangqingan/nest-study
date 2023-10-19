import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
// jwt 解码策略，验证是否携带token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test123456',
    } as StrategyOptions);
  }

  async validate(user: User) {
    // 自动解析token信息到user对象上了
    const isExist = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!isExist) {
      throw new UnauthorizedException('token不存在');
    }
    return isExist; // 这个返回也是会挂载到rea的user对象上
  }
}
