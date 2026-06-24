// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  // 根据用户名密码去校验, 但是查询用户的逻辑应该在 UserModule 里
  async validateUser(username: string, pwd: string): Promise<any> {
    const user = await this.userService.findOneByName(username);

    console.log(username, pwd);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if (user.password !== pwd) {
      throw new UnauthorizedException('密码错误');
    }
    // 不返回密码
    const { password, ...result } = user;
    return result;
  }
}
