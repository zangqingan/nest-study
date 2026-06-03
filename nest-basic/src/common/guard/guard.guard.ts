import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class GuardGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('login check');
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    console.log('roles', roles);
    if (!roles) {
      return true;
    }
    // 这里可以添加实际的权限验证逻辑，比如从请求头获取用户信息，判断用户角色等
    // 例如，假设我们从请求头获取用户角色，并进行简单的验证
    const request = context.switchToHttp().getRequest();
    const userRole = 'admin'; // 这里应该是从用户信息中获取的角色，暂时写死为 admin
    console.log('userRole', userRole);
    if (roles.includes(userRole)) {
      return true; // 用户角色匹配，允许访问
    }
    return false; // 用户角色不匹配，拒绝访问
  }
}
