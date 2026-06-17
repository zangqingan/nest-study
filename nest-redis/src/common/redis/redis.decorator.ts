import { SetMetadata, applyDecorators } from '@nestjs/common';

// ── metadata keys ─────────────────────────────

/** 标记需要缓存的 key 前缀 */
export const REDIS_CACHE_KEY = 'redis:cache';

/** 标记需要清除的缓存模式 */
export const REDIS_CACHE_EVICT_KEY = 'redis:cache-evict';

// ── metadata 类型 ─────────────────────────────

export interface RedisCacheMetadata {
  /** 自定义 key 前缀，默认为类名:方法名 */
  prefix?: string;
  /** 过期时间（秒），默认 60 */
  ttl: number;
  /** 自定义 key 生成函数名（需在同类中定义，签名 (args: any[]) => string） */
  keyBuilder?: string;
}

export interface RedisCacheEvictMetadata {
  /** 要清除的缓存 key 模式，支持 `{paramName}` 占位符 */
  pattern: string;
  /** 是否在所有参数执行前清除（默认 false，即方法执行后清除） */
  beforeInvocation?: boolean;
}

// ── 装饰器 ────────────────────────────────────

/**
 * 缓存方法返回值
 *
 * @example
 * ```ts
 * @RedisCache({ ttl: 60, prefix: 'user' })
 * async getUser(id: number): Promise<User> { ... }
 *
 * @RedisCache({ ttl: 300, keyBuilder: 'buildCacheKey' })
 * async getList(page: number, size: number): Promise<List> { ... }
 * ```
 */
export function RedisCache(options: RedisCacheMetadata) {
  return SetMetadata(REDIS_CACHE_KEY, { ...options, ttl: options.ttl ?? 60 });
}

/**
 * 清除匹配的缓存
 *
 * @example
 * ```ts
 * @RedisCacheEvict({ pattern: 'user:*' })
 * async updateUser(id: number): Promise<void> { ... }
 * ```
 */
export function RedisCacheEvict(options: RedisCacheEvictMetadata) {
  return SetMetadata(REDIS_CACHE_EVICT_KEY, options);
}

/**
 * 组合：读时缓存 + 写时清缓存
 *
 * @example
 * ```ts
 * @RedisCaching({
 *   cache: { ttl: 60, prefix: 'user' },
 *   evict: { pattern: 'user:*' },
 * })
 * async updateUser(id: number): Promise<User> { ... }
 * ```
 */
export function RedisCaching(config: {
  cache?: RedisCacheMetadata;
  evict?: RedisCacheEvictMetadata;
}) {
  const decorators: MethodDecorator[] = [];
  if (config.cache) decorators.push(RedisCache(config.cache));
  if (config.evict) decorators.push(RedisCacheEvict(config.evict));
  return applyDecorators(...decorators);
}
