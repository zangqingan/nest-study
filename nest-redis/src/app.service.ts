import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './common/redis/redis.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly redis: RedisService) {}

  // ═══════════════════════════════════════════
  //  基础缓存读写
  // ═══════════════════════════════════════════
  async getUser(id: number): Promise<User> {
    this.logger.log(`查询用户 id=${id}（如果缓存命中不会进入这里）`);
    // 模拟 DB 查询
    return { id, name: `User-${id}`, email: `user${id}@example.com` };
  }

  /** 更新用户 */
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    this.logger.log(`更新用户 id=${id}`);
    const user = await this.getUser(id); // 手动调用，不使用缓存
    return { ...user, ...data };
  }

  // ═══════════════════════════════════════════
  //  String 计数器
  // ═══════════════════════════════════════════

  async getPageViews(page: string): Promise<number> {
    return this.redis.incr(`pv:${page}`);
  }

  async getStock(productId: string): Promise<number> {
    const val = await this.redis.getRaw(`stock:${productId}`);
    return val ? parseInt(val, 10) : 0;
  }

  async decrStock(productId: string, count = 1): Promise<number> {
    return this.redis.decrby(`stock:${productId}`, count);
  }

  // ═══════════════════════════════════════════
  //  Hash —— 用户属性存储
  // ═══════════════════════════════════════════

  async saveUserProfile(userId: number, profile: Record<string, any>) {
    console.log(profile);
    await this.redis.hmset(`user:${userId}:profile`, profile);
  }

  async getUserProfile(userId: number): Promise<Record<string, any>> {
    return this.redis.hgetall(`user:${userId}:profile`);
  }

  async updateUserAge(userId: number, increment: number) {
    return this.redis.hincrby(`user:${userId}:profile`, 'age', increment);
  }

  // ═══════════════════════════════════════════
  //  List —— 消息队列 / 时间线
  // ═══════════════════════════════════════════

  async sendMessage(message: string) {
    return this.redis.lpush('messages', { message, ts: Date.now() });
  }

  async receiveMessages(count = 10): Promise<any[]> {
    return this.redis.lrange('messages', 0, count - 1);
  }

  async consumeMessage(): Promise<any | null> {
    return this.redis.rpop('messages');
  }

  // 阻塞消费（高级用法）
  async blockingConsume(timeout = 5): Promise<any | null> {
    const result = await this.redis.brpop('messages', timeout);
    return result ? result[1] : null;
  }

  // ═══════════════════════════════════════════
  //  Set —— 标签 / 去重
  // ═══════════════════════════════════════════

  async addTags(postId: number, ...tags: string[]) {
    return this.redis.sadd(`post:${postId}:tags`, ...tags);
  }

  async getTags(postId: number): Promise<string[]> {
    return this.redis.smembers(`post:${postId}:tags`);
  }

  async commonTags(postA: number, postB: number): Promise<string[]> {
    return this.redis.sinter(`post:${postA}:tags`, `post:${postB}:tags`);
  }

  // ═══════════════════════════════════════════
  //  Sorted Set —— 排行榜
  // ═══════════════════════════════════════════

  async addScore(userId: number, score: number) {
    return this.redis.zadd('leaderboard', [userId, score]);
  }

  async getTop10() {
    return this.redis.zrevrange('leaderboard', 0, 9, true);
  }

  async getUserRank(userId: number) {
    const rank = await this.redis.zrevrank('leaderboard', userId);
    const score = await this.redis.zscore('leaderboard', userId);
    return {
      rank: rank !== null ? rank + 1 : null,
      score: score ? parseFloat(score) : null,
    };
  }

  // ═══════════════════════════════════════════
  //  分布式锁
  // ═══════════════════════════════════════════

  async placeOrder(orderId: string): Promise<string> {
    const lockKey = `order:${orderId}`;
    const acquired = await this.redis.acquireLock(lockKey, {
      ttlSeconds: 10,
      retryTimes: 3,
    });

    if (!acquired) {
      return '订单处理中，请勿重复提交';
    }

    try {
      // 模拟业务处理
      this.logger.log(`正在处理订单 ${orderId}...`);
      await this.delay(200);
      return `订单 ${orderId} 处理完成`;
    } finally {
      await this.redis.releaseLock(lockKey);
    }
  }

  // ═══════════════════════════════════════════
  //  Pipeline 批量操作
  // ═══════════════════════════════════════════

  async batchSetItems(items: Array<{ key: string; value: any; ttl?: number }>) {
    const pipeline = this.redis.pipeline();
    for (const item of items) {
      const val =
        typeof item.value === 'string'
          ? item.value
          : JSON.stringify(item.value);
      if (item.ttl) {
        pipeline.set(item.key, val, 'EX', item.ttl);
      } else {
        pipeline.set(item.key, val);
      }
    }
    return pipeline.exec();
  }

  // ═══════════════════════════════════════════
  //  Pub/Sub 发布
  // ═══════════════════════════════════════════

  async broadcast(channel: string, event: any) {
    return this.redis.publish(channel, event);
  }

  // ═══════════════════════════════════════════
  //  Transaction 事务
  // ═══════════════════════════════════════════

  async transfer(from: string, to: string, amount: number): Promise<boolean> {
    // 先用 setnx 初始化（不存在时设为 0）
    await this.redis.setnx(`balance:${from}`, 0);
    await this.redis.setnx(`balance:${to}`, 0);

    const multi = this.redis.multi();
    multi.decrby(`balance:${from}`, amount);
    multi.incrby(`balance:${to}`, amount);
    const results = await multi.exec();

    // 检查是否有错误（如果余额不足，decrby 可能返回负数，但不会失败）
    if (!results) return false;
    return true;
  }

  async getBalance(account: string): Promise<number> {
    const val = await this.redis.getRaw(`balance:${account}`);
    return val ? parseInt(val, 10) : 0;
  }

  // ═══════════════════════════════════════════
  //  健康检查
  // ═══════════════════════════════════════════

  async health(): Promise<string> {
    return this.redis.ping();
  }

  // ── utils ──────────────────────────────────

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
