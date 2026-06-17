import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RedisCacheInterceptor } from './common/redis/redis-cache.interceptor';
import { RedisCache, RedisCacheEvict } from './common/redis/redis.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ── 基础缓存 带缓存自动管理的用户查询

  /** 获取用户（自动缓存 60s，通过 @RedisCache 装饰器） */
  @UseInterceptors(RedisCacheInterceptor)
  @RedisCache({ ttl: 60, prefix: 'user' })
  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(+id);
  }

  /** 更新用户（自动清除缓存，通过 @RedisCacheEvict 装饰器） */
  @UseInterceptors(RedisCacheInterceptor)
  @RedisCacheEvict({ pattern: 'cache:user:*' })
  @Post('user/:id')
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.appService.updateUser(+id, data);
  }

  // ── 计数器 ─────────────────────────────────
  // 计数器（PV 统计、库存扣减）

  @Get('pv/:page')
  pageView(@Param('page') page: string) {
    return this.appService.getPageViews(page);
  }

  @Get('stock/:id')
  getStock(@Param('id') id: string) {
    return this.appService.getStock(id);
  }

  @Post('stock/:id/dec')
  decrStock(@Param('id') id: string, @Query('count') count: string) {
    return this.appService.decrStock(id, count ? +count : 1);
  }

  // ── Hash ────────────────────────────────────
  // Hash 用户属性存储

  @Post('profile/:id')
  saveProfile(@Param('id') id: string, @Body() profile: any) {
    return this.appService.saveUserProfile(+id, profile);
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.appService.getUserProfile(+id);
  }

  @Post('profile/:id/age')
  incrAge(@Param('id') id: string, @Query('n') n: string) {
    return this.appService.updateUserAge(+id, n ? +n : 1);
  }

  // ── List 消息队列 ──────────────────────────

  @Post('message')
  sendMessage(@Body('message') message: string) {
    return this.appService.sendMessage(message);
  }

  @Get('messages')
  getMessages(@Query('count') count: string) {
    return this.appService.receiveMessages(count ? +count : 10);
  }

  @Get('messages/consume')
  consumeMessage() {
    return this.appService.consumeMessage();
  }

  // ── Set 标签 ───────────────────────────────

  @Post('post/:id/tags')
  addTags(@Param('id') id: string, @Body('tags') tags: string[]) {
    return this.appService.addTags(+id, ...(tags ?? []));
  }

  @Get('post/:id/tags')
  getTags(@Param('id') id: string) {
    return this.appService.getTags(+id);
  }

  @Get('post/:a/common/:b')
  commonTags(@Param('a') a: string, @Param('b') b: string) {
    return this.appService.commonTags(+a, +b);
  }

  // ── SortedSet 排行榜 ────────────────────────

  @Post('leaderboard/:id')
  addScore(@Param('id') id: string, @Query('score') score: string) {
    return this.appService.addScore(+id, score ? +score : 1);
  }

  @Get('leaderboard')
  getTop10() {
    return this.appService.getTop10();
  }

  @Get('leaderboard/:id')
  getRank(@Param('id') id: string) {
    return this.appService.getUserRank(+id);
  }

  // ── 分布式锁 ───────────────────────────────

  @Post('order/:id')
  placeOrder(@Param('id') id: string) {
    return this.appService.placeOrder(id);
  }

  // ── Transaction ─────────────────────────────

  @Post('transfer')
  transfer(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string,
  ) {
    return this.appService.transfer(from, to, +amount);
  }

  @Get('balance/:account')
  balance(@Param('account') account: string) {
    return this.appService.getBalance(account);
  }

  // ── 健康检查 ───────────────────────────────

  @Get('health')
  health() {
    return this.appService.health();
  }
}
