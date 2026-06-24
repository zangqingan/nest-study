import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Session,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guard/jwtAuth.guard';
import type { Request, Response } from 'express';
import { AppService } from './app.service';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('session')
  getSession(@Session() session: any) {
    console.log(session);
    session.userId = session.id ? session.id + 1 : 1;
    return session.userId;
  }

  @Post('login')
  login(
    @Req() req: Request,
    @Body() body: { username: string; password: string },
  ) {
    // 验证用户逻辑...
    const user = { id: 1, username: 'john' };

    // 将用户信息存入 session
    req.session.userId = user.id;
    req.session.username = body.username;

    return { message: '登录成功', user };
  }

  // 读取session
  @Get('profile')
  getProfile(@Req() req: Request) {
    console.log(req.session);
    if (req.session.userId) {
      return { userId: req.session.userId, username: req.session.username };
    }
    return { message: '未登录' };
  }

  // 销毁session登出
  @Post('logout')
  logout(@Req() req: Request) {
    req.session.destroy((err) => {
      if (err) throw err;
      // 可选：同时清除客户端 cookie（一般不需要，因为 session 已销毁）
    });
    console.log(req.session);
    return { message: '已登出' };
  }

  // 生成token
  // 响应头返回
  @Get('jwt-header')
  getJwt(@Res({ passthrough: true }) response: Response) {
    const newToken = this.jwtService.sign({
      count: 1,
      name: 'zhangsan',
    });

    response.setHeader('token', newToken);
    return 'hello';
  }

  // 请求体返回
  @Get('jwt-body')
  getJwtBody() {
    const newToken = this.jwtService.sign({
      count: 1,
      name: 'zhangsan',
    });
    return { token: newToken };
  }

  // 之后可以直接检查是否携带token并验证
  @Get('verifyHeaderToken')
  getHeaderToken(@Req() request: Request) {
    const token = request.headers['token'];
    if (!token) {
      return 'token不存在';
    }
    const payload = this.jwtService.verify(token as string);
    return payload;
  }
  // 或者通过 @Headers() 装饰器
  @Get('verifyHeaderToken1')
  getHeaderToken1(@Headers('authorization') authorization: string) {
    if (!authorization) {
      return 'token不存在';
    }
    console.log(authorization);
    const token = authorization.split(' ')[1];
    const payload1 = this.jwtService.verify(token);
    return payload1;
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt-list')
  getJwtList(@Req() req: Request) {
    console.log('JwtAuthGuard req.user', req.user);
    return req.user;
  }
}
