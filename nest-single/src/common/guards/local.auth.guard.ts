// 直接将策略名称传递给 AuthGuard() 会在代码库中引入魔术字符串。相反，我们建议创建自己的类
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
