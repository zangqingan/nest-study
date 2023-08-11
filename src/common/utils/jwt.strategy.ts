import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../../modules/user/user.service';
import { User } from '../../modules/user/entities/user.entity';

export class JwtStorage extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'test123456',
    } as StrategyOptions);
  }

  async validate(user: User) {
    const existUser = await this.userService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
