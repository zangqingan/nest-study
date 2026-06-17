import Redis from 'ioredis';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from '@nestjs/common';
import { REDIS_OPTIONS } from './redis.constants';
import type { RedisOptions, LockOptions } from './redis.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_OPTIONS) private options: RedisOptions) {}

  // ── 生命周期 ─────────────────────────────────

  async onModuleInit() {
    this.client = new Redis({
      host: this.options.host,
      port: this.options.port,
      password: this.options.password,
      db: this.options.db,
      keyPrefix: this.options.keyPrefix || '',
      maxRetriesPerRequest: this.options.maxRetriesPerRequest ?? 3,
      connectTimeout: this.options.connectTimeout ?? 10000,
      tls: this.options.tls ? {} : undefined,
      retryStrategy: (times) => Math.min(times * 100, 3000),
      lazyConnect: false,
    });

    this.client.on('connect', () => this.logger.log('Redis 连接成功'));
    this.client.on('error', (err) => this.logger.error('Redis 错误', err));
    this.client.on('close', () => this.logger.warn('Redis 连接关闭'));
    this.client.on('reconnecting', () => this.logger.warn('Redis 重连中...'));

    await this.client.ping();
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis 连接已释放');
  }

  // ══════════════════════════════════════════════
  //  基础 Key 操作
  // ══════════════════════════════════════════════

  /** 获取值（自动 JSON.parse） */
  async get<T = any>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as any;
    }
  }

  /** 获取原始字符串（不做 JSON 解析） */
  async getRaw(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * 设置值
   * @param ttl - 过期时间（秒），不传则永不过期
   */
  async set(key: string, value: any, ttl?: number): Promise<'OK' | null> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      return this.client.set(key, serialized, 'EX', ttl);
    }
    return this.client.set(key, serialized);
  }

  /**
   * 仅在 key 不存在时设置（SET NX）
   * 返回 null 表示 key 已存在，设置失败
   */
  async setnx(key: string, value: any): Promise<boolean> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    const result = await this.client.set(key, serialized, 'NX');
    return result === 'OK';
  }

  /** 设置值并返回旧值 */
  async getset(key: string, value: any): Promise<string | null> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    return this.client.getset(key, serialized);
  }

  /** 删除 key，返回删除数量 */
  async del(...keys: string[]): Promise<number> {
    return this.client.del(keys);
  }

  /** 判断 key 是否存在，返回存在数量 */
  async exists(...keys: string[]): Promise<number> {
    return this.client.exists(keys);
  }

  /** 设置过期时间（秒） */
  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /** 设置在某个时间戳过期（Unix 秒） */
  async expireat(key: string, timestamp: number): Promise<number> {
    return this.client.expireat(key, timestamp);
  }

  /** 移除过期时间（使其永久有效） */
  async persist(key: string): Promise<number> {
    return this.client.persist(key);
  }

  /** 获取剩余过期时间（秒），-1 永不过期，-2 不存在 */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  /** 查找匹配模式的 key（慎用，生产建议用 scan） */
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  /** 渐进式扫描 key（推荐生产使用） */
  async scan(cursor: string, pattern?: string, count = 100) {
    if (pattern) {
      return this.client.scan(cursor, 'MATCH', pattern, 'COUNT', count);
    }
    return this.client.scan(cursor, 'COUNT', count);
  }

  /** 获取 key 类型 */
  async type(key: string): Promise<string> {
    return this.client.type(key);
  }

  /** 重命名 key */
  async rename(oldKey: string, newKey: string): Promise<'OK'> {
    return this.client.rename(oldKey, newKey);
  }

  // ══════════════════════════════════════════════
  //  计数器
  // ══════════════════════════════════════════════

  /** 自增 1，返回新值 */
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  /** 自增 n */
  async incrby(key: string, increment: number): Promise<number> {
    return this.client.incrby(key, increment);
  }

  /** 自增浮点数 */
  async incrbyfloat(key: string, increment: number): Promise<string> {
    return this.client.incrbyfloat(key, increment);
  }

  /** 自减 1 */
  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  /** 自减 n */
  async decrby(key: string, decrement: number): Promise<number> {
    return this.client.decrby(key, decrement);
  }

  // ══════════════════════════════════════════════
  //  批量操作
  // ══════════════════════════════════════════════

  async mget<T = any>(...keys: string[]): Promise<(T | null)[]> {
    const values = await this.client.mget(keys);
    return values.map((v) => {
      if (!v) return null;
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as any;
      }
    });
  }

  async mset(items: Record<string, any>): Promise<'OK'> {
    const entries: string[] = [];
    for (const [k, v] of Object.entries(items)) {
      entries.push(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
    return this.client.mset(entries);
  }

  // ══════════════════════════════════════════════
  //  Hash 哈希操作
  // ══════════════════════════════════════════════

  async hset(key: string, field: string, value: any): Promise<number> {
    return this.client.hset(
      key,
      field,
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  }

  async hmset(key: string, map: Record<string, any>): Promise<'OK'> {
    const entries: Record<string, string> = {};
    for (const [k, v] of Object.entries(map)) {
      entries[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    return this.client.hmset(key, entries);
  }

  async hget<T = any>(key: string, field: string): Promise<T | null> {
    const val = await this.client.hget(key, field);
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as any;
    }
  }

  async hmget<T = any>(
    key: string,
    ...fields: string[]
  ): Promise<(T | null)[]> {
    const values = await this.client.hmget(key, ...fields);
    return values.map((v) => {
      if (!v) return null;
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as any;
      }
    });
  }

  async hgetall<T = any>(key: string): Promise<Record<string, T>> {
    const raw = await this.client.hgetall(key);
    const result: Record<string, T> = {};
    for (const [field, val] of Object.entries(raw)) {
      try {
        result[field] = JSON.parse(val) as T;
      } catch {
        result[field] = val as any;
      }
    }
    return result;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  async hexists(key: string, field: string): Promise<number> {
    return this.client.hexists(key, field);
  }

  async hkeys(key: string): Promise<string[]> {
    return this.client.hkeys(key);
  }

  async hvals<T = any>(key: string): Promise<T[]> {
    const values = await this.client.hvals(key);
    return values.map((v) => {
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as any;
      }
    });
  }

  async hlen(key: string): Promise<number> {
    return this.client.hlen(key);
  }

  async hincrby(
    key: string,
    field: string,
    increment: number,
  ): Promise<number> {
    return this.client.hincrby(key, field, increment);
  }

  async hincrbyfloat(
    key: string,
    field: string,
    increment: number,
  ): Promise<string> {
    return this.client.hincrbyfloat(key, field, increment);
  }

  /** 获取 hash 所有字段名和值（原始字符串，不做 JSON 解析） */
  async hscan(key: string, cursor: string, pattern?: string, count = 100) {
    if (pattern) {
      return this.client.hscan(key, cursor, 'MATCH', pattern, 'COUNT', count);
    }
    return this.client.hscan(key, cursor, 'COUNT', count);
  }

  // ══════════════════════════════════════════════
  //  List 列表操作
  // ══════════════════════════════════════════════

  async lpush(key: string, ...values: any[]): Promise<number> {
    const serialized = values.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.lpush(key, ...serialized);
  }

  async rpush(key: string, ...values: any[]): Promise<number> {
    const serialized = values.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.rpush(key, ...serialized);
  }

  async lpop<T = any>(key: string): Promise<T | null> {
    const val = await this.client.lpop(key);
    return this.deserialize(val);
  }

  async rpop<T = any>(key: string): Promise<T | null> {
    const val = await this.client.rpop(key);
    return this.deserialize(val);
  }

  /** 阻塞式左弹出（用于消息队列） */
  async blpop<T = any>(
    key: string,
    timeout: number,
  ): Promise<[string, T] | null> {
    const result = await this.client.blpop(key, timeout);
    if (!result) return null;
    return [result[0], this.deserialize(result[1]) as T];
  }

  /** 阻塞式右弹出 */
  async brpop<T = any>(
    key: string,
    timeout: number,
  ): Promise<[string, T] | null> {
    const result = await this.client.brpop(key, timeout);
    if (!result) return null;
    return [result[0], this.deserialize(result[1]) as T];
  }

  async lrange<T = any>(
    key: string,
    start: number,
    stop: number,
  ): Promise<T[]> {
    const values = await this.client.lrange(key, start, stop);
    return values.map((v) => this.deserialize(v) as T);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  async lindex<T = any>(key: string, index: number): Promise<T | null> {
    return this.deserialize(await this.client.lindex(key, index));
  }

  /** 删除 count 个值为 value 的元素（count>0 从头，count<0 从尾，count=0 全部） */
  async lrem(key: string, count: number, value: any): Promise<number> {
    const serialized =
      typeof value === 'string' ? value : JSON.stringify(value);
    return this.client.lrem(key, count, serialized);
  }

  async ltrim(key: string, start: number, stop: number): Promise<'OK'> {
    return this.client.ltrim(key, start, stop);
  }

  /** 在 key 列表头部设置值（仅当 key 存在） */
  async lpushx(key: string, ...values: any[]): Promise<number> {
    const serialized = values.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.lpushx(key, ...serialized);
  }

  // ══════════════════════════════════════════════
  //  Set 集合操作
  // ══════════════════════════════════════════════

  async sadd(key: string, ...members: any[]): Promise<number> {
    const serialized = members.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.sadd(key, ...serialized);
  }

  async srem(key: string, ...members: any[]): Promise<number> {
    const serialized = members.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.srem(key, ...serialized);
  }

  async smembers<T = any>(key: string): Promise<T[]> {
    const members = await this.client.smembers(key);
    return members.map((v) => this.deserialize(v) as T);
  }

  async sismember(key: string, member: any): Promise<number> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.sismember(key, serialized);
  }

  async scard(key: string): Promise<number> {
    return this.client.scard(key);
  }

  async spop<T = any>(key: string, count?: number): Promise<T | T[] | null> {
    const result = await (count
      ? this.client.spop(key, count)
      : this.client.spop(key));
    if (!result) return null;
    if (Array.isArray(result)) {
      return result.map((v) => this.deserialize(v) as T);
    }
    return this.deserialize(result);
  }

  /** 随机获取一个或多个成员（不移除） */
  async srandmember<T = any>(
    key: string,
    count?: number,
  ): Promise<T | T[] | null> {
    const result = count
      ? await this.client.srandmember(key, count)
      : await this.client.srandmember(key);
    if (!result) return null;
    if (Array.isArray(result)) {
      return result.map((v) => this.deserialize(v) as T);
    }
    return this.deserialize(result);
  }

  /** 将 member 从 source 移动到 destination */
  async smove(
    source: string,
    destination: string,
    member: any,
  ): Promise<number> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.smove(source, destination, serialized);
  }

  /** 交集 */
  async sinter<T = any>(...keys: string[]): Promise<T[]> {
    const result = await this.client.sinter(keys);
    return result.map((v) => this.deserialize(v) as T);
  }

  /** 并集 */
  async sunion<T = any>(...keys: string[]): Promise<T[]> {
    const result = await this.client.sunion(keys);
    return result.map((v) => this.deserialize(v) as T);
  }

  /** 差集（keys[0] - keys[1..]） */
  async sdiff<T = any>(...keys: string[]): Promise<T[]> {
    const result = await this.client.sdiff(keys);
    return result.map((v) => this.deserialize(v) as T);
  }

  // ══════════════════════════════════════════════
  //  Sorted Set 有序集合操作
  // ══════════════════════════════════════════════

  /**
   * 添加成员及其分数（支持批量）
   * @param entries - [member, score] 元组数组
   */
  async zadd(
    key: string,
    ...entries: Array<[member: any, score: number]>
  ): Promise<number> {
    const args: (string | number)[] = [];
    for (const [member, score] of entries) {
      args.push(
        score,
        typeof member === 'string' ? member : JSON.stringify(member),
      );
    }
    return this.client.zadd(key, ...args);
  }

  /** 按索引范围获取（升序） */
  async zrange<T = any>(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<T[] | Array<{ member: T; score: number }>> {
    if (withScores) {
      const result = await this.client.zrange(key, start, stop, 'WITHSCORES');
      return this.parseZRangeResult(result);
    }
    const members = await this.client.zrange(key, start, stop);
    return members.map((v) => this.deserialize(v) as T);
  }

  /** 按索引范围获取（降序） */
  async zrevrange<T = any>(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<T[] | Array<{ member: T; score: number }>> {
    if (withScores) {
      const result = await this.client.zrevrange(
        key,
        start,
        stop,
        'WITHSCORES',
      );
      return this.parseZRangeResult(result);
    }
    const members = await this.client.zrevrange(key, start, stop);
    return members.map((v) => this.deserialize(v) as T);
  }

  /** 按分数范围获取（升序） */
  async zrangebyscore<T = any>(
    key: string,
    min: number | string,
    max: number | string,
    withScores = false,
    offset?: number,
    count?: number,
  ): Promise<T[] | Array<{ member: T; score: number }>> {
    if (withScores && offset !== undefined && count !== undefined) {
      const result = await this.client.zrangebyscore(
        key,
        min,
        max,
        'WITHSCORES',
        'LIMIT',
        offset,
        count,
      );
      return this.parseZRangeResult(result as string[]);
    }
    if (withScores) {
      const result = await this.client.zrangebyscore(
        key,
        min,
        max,
        'WITHSCORES',
      );
      return this.parseZRangeResult(result as string[]);
    }
    if (offset !== undefined && count !== undefined) {
      const members = (await this.client.zrangebyscore(
        key,
        min,
        max,
        'LIMIT',
        offset,
        count,
      )) as string[];
      return members.map((v) => this.deserialize(v) as T);
    }
    const members = (await this.client.zrangebyscore(
      key,
      min,
      max,
    )) as string[];
    return members.map((v) => this.deserialize(v) as T);
  }

  /** 按分数范围获取（降序） */
  async zrevrangebyscore<T = any>(
    key: string,
    max: number | string,
    min: number | string,
    withScores = false,
    offset?: number,
    count?: number,
  ): Promise<T[] | Array<{ member: T; score: number }>> {
    if (withScores && offset !== undefined && count !== undefined) {
      const result = await this.client.zrevrangebyscore(
        key,
        max,
        min,
        'WITHSCORES',
        'LIMIT',
        offset,
        count,
      );
      return this.parseZRangeResult(result as string[]);
    }
    if (withScores) {
      const result = await this.client.zrevrangebyscore(
        key,
        max,
        min,
        'WITHSCORES',
      );
      return this.parseZRangeResult(result as string[]);
    }
    if (offset !== undefined && count !== undefined) {
      const members = (await this.client.zrevrangebyscore(
        key,
        max,
        min,
        'LIMIT',
        offset,
        count,
      )) as string[];
      return members.map((v) => this.deserialize(v) as T);
    }
    const members = (await this.client.zrevrangebyscore(
      key,
      max,
      min,
    )) as string[];
    return members.map((v) => this.deserialize(v) as T);
  }

  /** 删除一个或多个成员 */
  async zrem(key: string, ...members: any[]): Promise<number> {
    const serialized = members.map((v) =>
      typeof v === 'string' ? v : JSON.stringify(v),
    );
    return this.client.zrem(key, ...serialized);
  }

  /** 获取成员排名（升序，从 0 开始） */
  async zrank(key: string, member: any): Promise<number | null> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.zrank(key, serialized);
  }

  /** 获取成员排名（降序） */
  async zrevrank(key: string, member: any): Promise<number | null> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.zrevrank(key, serialized);
  }

  /** 获取成员分数 */
  async zscore(key: string, member: any): Promise<string | null> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.zscore(key, serialized);
  }

  /** 获取有序集合成员数 */
  async zcard(key: string): Promise<number> {
    return this.client.zcard(key);
  }

  /** 统计分数范围内的成员数 */
  async zcount(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    return this.client.zcount(key, min, max);
  }

  /** 增加成员分数 */
  async zincrby(key: string, increment: number, member: any): Promise<string> {
    const serialized =
      typeof member === 'string' ? member : JSON.stringify(member);
    return this.client.zincrby(key, increment, serialized);
  }

  /** 删除排名范围内的成员 */
  async zremrangebyrank(
    key: string,
    start: number,
    stop: number,
  ): Promise<number> {
    return this.client.zremrangebyrank(key, start, stop);
  }

  /** 删除分数范围内的成员 */
  async zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<number> {
    return this.client.zremrangebyscore(key, min, max);
  }

  // ══════════════════════════════════════════════
  //  Pipeline & Transaction
  // ══════════════════════════════════════════════

  /** 创建 Pipeline（批量执行，不保证原子性） */
  pipeline(commands?: unknown[][]) {
    return this.client.pipeline(commands);
  }

  /** 创建事务（MULTI/EXEC，保证原子性） */
  multi(commands?: unknown[][]) {
    return this.client.multi(commands);
  }

  // ══════════════════════════════════════════════
  //  分布式锁（Redlock 简化版）
  // ══════════════════════════════════════════════

  /**
   * 获取分布式锁
   * @param key - 锁标识
   * @param options - 锁选项
   * @returns 是否成功获取锁
   */
  async acquireLock(key: string, options: LockOptions): Promise<boolean> {
    const { ttlSeconds, retryTimes = 3, retryDelay = 100 } = options;
    const lockKey = `lock:${key}`;
    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    for (let i = 0; i < retryTimes; i++) {
      // SET key value NX EX seconds（ioredis v5 中 set 支持额外参数）
      const result = await (this.client.set as any)(
        lockKey,
        token,
        'NX',
        'EX',
        ttlSeconds,
      );
      if (result === 'OK') {
        // 将 token 挂到客户端上（简单方案）
        (this.client as any)[`_lock_token:${lockKey}`] = token;
        return true;
      }
      if (i < retryTimes - 1) {
        await this.sleep(retryDelay);
      }
    }
    return false;
  }

  /**
   * 释放锁（Lua 脚本保证原子性 —— 只删除自己持有的锁）
   */
  async releaseLock(key: string): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const token = (this.client as any)[`_lock_token:${lockKey}`];
    if (!token) {
      // 未持有锁，跳过
      return false;
    }

    const luaScript = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.client.eval(luaScript, 1, lockKey, token);
    delete (this.client as any)[`_lock_token:${lockKey}`];
    return result === 1;
  }

  /**
   * 续期锁的过期时间（仅当持有该锁时）
   */
  async renewLock(key: string, ttlSeconds: number): Promise<boolean> {
    const lockKey = `lock:${key}`;
    const token = (this.client as any)[`_lock_token:${lockKey}`];
    if (!token) return false;

    const luaScript = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("EXPIRE", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;
    return (
      (await this.client.eval(luaScript, 1, lockKey, token, ttlSeconds)) === 1
    );
  }

  // ══════════════════════════════════════════════
  //  Pub/Sub 发布订阅
  // ══════════════════════════════════════════════

  /** 发布消息 */
  async publish(channel: string, message: any): Promise<number> {
    const serialized =
      typeof message === 'string' ? message : JSON.stringify(message);
    return this.client.publish(channel, serialized);
  }

  /**
   * 订阅频道（返回订阅实例，调用方管理生命周期）
   * 注意：订阅模式需要独立的 Redis 连接，此处使用 client.duplicate()
   */
  subscribe(
    channels: string[],
    onMessage: (channel: string, message: string) => void,
  ): Redis {
    const sub = this.client.duplicate();
    sub.on('message', onMessage);
    sub.subscribe(...channels);
    return sub; // 调用方负责在适当时刻 sub.quit()
  }

  // ══════════════════════════════════════════════
  //  模式匹配删除
  // ══════════════════════════════════════════════

  /** 按模式删除 key（慎用，生产建议限制 COUNT） */
  async deletePattern(pattern: string, batchSize = 100): Promise<number> {
    let cursor = '0';
    let deleted = 0;
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        batchSize,
      );
      cursor = nextCursor;
      if (keys.length) {
        deleted += await this.client.del(keys);
      }
    } while (cursor !== '0');
    return deleted;
  }

  /** 按模式查找 key（不删除） */
  async findKeys(pattern: string, batchSize = 100): Promise<string[]> {
    let cursor = '0';
    const result: string[] = [];
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        batchSize,
      );
      cursor = nextCursor;
      result.push(...keys);
    } while (cursor !== '0');
    return result;
  }

  // ══════════════════════════════════════════════
  //  工具方法
  // ══════════════════════════════════════════════

  /** 获取原始 ioredis 客户端（用于高级场景） */
  getClient(): Redis {
    return this.client;
  }

  /** 健康检查 */
  async ping(): Promise<'PONG'> {
    return this.client.ping();
  }

  /** 清空当前数据库（危险操作） */
  async flushdb(): Promise<'OK'> {
    this.logger.warn('⚠️ 正在清空当前 Redis 数据库 (FLUSHDB)');
    return this.client.flushdb();
  }

  // ── private ──────────────────────────────────

  private deserialize<T>(val: string | null): T | null {
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return val as any;
    }
  }

  private parseZRangeResult<T>(
    result: string[],
  ): Array<{ member: T; score: number }> {
    const parsed: Array<{ member: T; score: number }> = [];
    for (let i = 0; i < result.length; i += 2) {
      parsed.push({
        member: this.deserialize(result[i]) as T,
        score: parseFloat(result[i + 1]),
      });
    }
    return parsed;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
