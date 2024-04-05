/**
 * 登录验证守卫，只用来判断是否携带token即是否是登录状态。
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  // 注入用户仓库
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';

    const bearer = authorization.split(' ');

    // 没有token直接报错
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }
    const token = bearer[1];
    // 有还要进一步验证
    try {
      const info = this.jwtService.verify(token);
      // 这个user也会被挂载到请求对象req的user对象上。
      // 它是前端传递的token的信息，包含userId和username。
      // 根据userId查询数据库，获取用户信息。
      const user = await this.userRepository.findOne({
        where: { id: info.id },
      });
      if (!user) {
        throw new UnauthorizedException('登录 token 错误2222');
      }
      (request as any).user = info;
      return true;
    } catch (e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
