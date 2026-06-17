import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from './redis.service';
import {
  REDIS_CACHE_KEY,
  REDIS_CACHE_EVICT_KEY,
  RedisCacheMetadata,
  RedisCacheEvictMetadata,
} from './redis.decorator';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RedisCacheInterceptor.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cacheMeta = this.reflector.get<RedisCacheMetadata>(
      REDIS_CACHE_KEY,
      context.getHandler(),
    );
    const evictMeta = this.reflector.get<RedisCacheEvictMetadata>(
      REDIS_CACHE_EVICT_KEY,
      context.getHandler(),
    );
    console.log(cacheMeta, evictMeta);
    // ── 1. 写操作前清除缓存 ──────────────────
    if (evictMeta?.beforeInvocation) {
      await this.evictCache(evictMeta.pattern, context);
    }

    // ── 2. 读缓存 ────────────────────────────
    if (cacheMeta) {
      const cacheKey = this.buildCacheKey(cacheMeta, context);
      try {
        const cached = await this.redisService.get(cacheKey);
        if (cached !== null) {
          this.logger.debug(`缓存命中: ${cacheKey}`);
          return of(cached); // 直接返回缓存值
        }
      } catch {
        // 缓存读取失败，继续执行原方法
      }

      return next.handle().pipe(
        tap(async (data) => {
          if (data !== undefined && data !== null) {
            try {
              await this.redisService.set(cacheKey, data, cacheMeta.ttl);
              this.logger.debug(
                `写入缓存: ${cacheKey} (TTL: ${cacheMeta.ttl}s)`,
              );
            } catch {
              // 写缓存失败不阻塞
            }
          }
        }),
      );
    }

    // ── 3. 写操作后清除缓存 ──────────────────
    if (evictMeta && !evictMeta.beforeInvocation) {
      return next.handle().pipe(
        tap(async () => {
          await this.evictCache(evictMeta.pattern, context);
        }),
      );
    }

    return next.handle();
  }

  // ── private helpers ──────────────────────────

  /**
   * 构建redis缓存的key
   * 支持自定义 keyBuilder（方法在同控制器中定义）
   * @param meta 缓存元数据
   * @param context 执行上下文
   * @returns 缓存 key
   */
  private buildCacheKey(
    meta: RedisCacheMetadata,
    context: ExecutionContext,
  ): string {
    const prefix = meta.prefix ?? this.getDefaultPrefix(context);
    const args = context.switchToHttp().getRequest()?.params ?? {};

    // 使用自定义 keyBuilder（方法在同控制器中定义）
    if (meta.keyBuilder) {
      const instance = context.getClass().prototype;
      const builder = instance[meta.keyBuilder];
      if (typeof builder === 'function') {
        const handlerArgs = context.getHandler().arguments;
        return `cache:${prefix}:${builder(args)}`;
      }
    }

    // 默认：prefix + JSON 序列化参数
    const argsStr = JSON.stringify(args);
    return `cache:${prefix}:${argsStr}`;
  }

  private getDefaultPrefix(context: ExecutionContext): string {
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;
    return `${className}:${handlerName}`;
  }

  private async evictCache(
    pattern: string,
    context: ExecutionContext,
  ): Promise<void> {
    try {
      const resolved = this.resolvePattern(pattern, context);
      const deleted = await this.redisService.deletePattern(resolved);
      if (deleted > 0) {
        this.logger.debug(`清除缓存模式 "${resolved}": ${deleted} 个 key`);
      }
    } catch {
      // 清除失败不阻塞
    }
  }

  /**
   * 将占位符模式的 key 解析成实际值
   * 支持 `{param}`、`{body.field}`、`{query.field}` 占位符
   */
  private resolvePattern(pattern: string, context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const params = request.params ?? {};
    const query = request.query ?? {};
    const body = request.body ?? {};

    return pattern.replace(/\{(\w+(?:\.\w+)*)\}/g, (_, path: string) => {
      const segments = path.split('.');
      let source: any;
      // 判断来源
      if (segments[0] === 'body') {
        source = body;
        segments.shift();
      } else if (segments[0] === 'query') {
        source = query;
        segments.shift();
      } else if (params[segments[0]] !== undefined) {
        // 默认为 param
        source = params;
      } else {
        source = { ...params, ...query, ...body };
      }
      let value: any = source;
      for (const seg of segments) {
        value = value?.[seg];
      }
      return value !== undefined ? String(value) : '*';
    });
  }
}
