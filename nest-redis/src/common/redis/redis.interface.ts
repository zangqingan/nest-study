// redis.interface.ts
import type { ModuleMetadata, Type } from '@nestjs/common';

export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  /** 最大重试次数，默认 10 */
  maxRetriesPerRequest?: number | null;
  /** 连接超时(ms)，默认 10000 */
  connectTimeout?: number;
  /** 是否启用 TLS */
  tls?: boolean;
}

/** 缓存行为选项 */
export interface CacheOptions {
  /** 过期时间（秒） */
  ttl?: number;
  /** 写入模式 */
  mode?: 'set' | 'setnx';
}

/** 分布式锁选项 */
export interface LockOptions {
  /** 锁的过期时间（秒） */
  ttlSeconds: number;
  /** 获取锁失败时的重试次数，默认 3 */
  retryTimes?: number;
  /** 重试间隔（ms），默认 100 */
  retryDelay?: number;
}

// ── 异步模块配置 ──────────────────────────────

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /** 全局化模块，默认 true */
  global?: boolean;
  /** useFactory 方式 */
  useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
  /** useClass 方式 */
  useClass?: Type<RedisOptionsFactory>;
  /** useExisting 方式 */
  useExisting?: Type<RedisOptionsFactory>;
  /** 注入 token 列表 */
  inject?: any[];
}

export interface RedisOptionsFactory {
  createRedisOptions(): Promise<RedisOptions> | RedisOptions;
}
