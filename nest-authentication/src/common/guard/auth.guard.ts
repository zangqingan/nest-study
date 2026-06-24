import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 对应少数接口可以提前验证返回进而忽略token校验(也就是不用token也能访问)
    // 一种是是否在白名单内
    // 一种是使用是公开接口(使用自定义装饰器声明的接口)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 查看此条件
      return true;
    }

    // 切换到http请求
    const request = context.switchToHttp().getRequest();
    // 获取token
    const token = this.extractTokenFromHeader(request);
    console.log('token', token);
    if (!token) {
      throw new UnauthorizedException('未提供 token');
    }
    // 验证token
    try {
      const payload = await this.jwtService.verify(token);
      console.log('payload', payload);
      // 💡 我们在这里将 payload 分配给 request 对象
      // 以便我们可以在路由处理程序中访问它
      request['user'] = payload;
    } catch (e) {
      console.log('e', e);
      throw new UnauthorizedException('登录 token 失效, 请重新登录');
    }
    return true;
  }
  // 从请求头中获取token
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
