import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisCacheInterceptor } from './redis-cache.interceptor';
import { REDIS_OPTIONS } from './redis.constants';
import type {
  RedisOptions,
  RedisModuleAsyncOptions,
  RedisOptionsFactory,
} from './redis.interface';

@Global()
@Module({})
export class RedisModule {
  /**
   * 同步注册 —— 直接传入 RedisOptions
   */
  static forRoot(options: RedisOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        { provide: REDIS_OPTIONS, useValue: options },
        RedisService,
        RedisCacheInterceptor,
      ],
      exports: [RedisService, RedisCacheInterceptor],
    };
  }

  /**
   * 异步注册 —— 支持 useFactory / useClass / useExisting 三种模式
   * 完全遵循 NestJS DynamicModule 异步标准
   */
  static forRootAsync(asyncOptions: RedisModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(asyncOptions);
    const imports = asyncOptions.imports ?? [];

    return {
      module: RedisModule,
      imports,
      providers: [...providers, RedisService, RedisCacheInterceptor],
      exports: [RedisService, RedisCacheInterceptor],
    };
  }

  // ── private helpers ──────────────────────────

  private static createAsyncProviders(
    options: RedisModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting ?? options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        { provide: options.useClass, useClass: options.useClass },
      ];
    }

    // 兼容：只传 inject + useFactory 的情况（即原 API 仍然可用）
    return [this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(
    options: RedisModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    // useClass / useExisting
    const inject = options.useExisting ?? options.useClass;
    return {
      provide: REDIS_OPTIONS,
      useFactory: async (factory: RedisOptionsFactory) =>
        factory.createRedisOptions(),
      inject: inject ? [inject as any] : [],
    };
  }
}
