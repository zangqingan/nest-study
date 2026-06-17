import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './common/redis/redis.service';
import { REDIS_OPTIONS } from './common/redis/redis.constants';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const mockRedisService = {
      ping: jest.fn().mockResolvedValue('PONG'),
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
      incr: jest.fn().mockResolvedValue(1),
      decrby: jest.fn().mockResolvedValue(9),
      getRaw: jest.fn().mockResolvedValue('100'),
      hmset: jest.fn().mockResolvedValue('OK'),
      hgetall: jest.fn().mockResolvedValue({ name: 'test', age: '25' }),
      hincrby: jest.fn().mockResolvedValue(26),
      lpush: jest.fn().mockResolvedValue(1),
      lrange: jest.fn().mockResolvedValue([]),
      rpop: jest.fn().mockResolvedValue(null),
      sadd: jest.fn().mockResolvedValue(3),
      smembers: jest.fn().mockResolvedValue(['nestjs', 'redis']),
      sinter: jest.fn().mockResolvedValue(['nestjs']),
      zadd: jest.fn().mockResolvedValue(1),
      zrevrange: jest.fn().mockResolvedValue([]),
      zrevrank: jest.fn().mockResolvedValue(null),
      zscore: jest.fn().mockResolvedValue(null),
      acquireLock: jest.fn().mockResolvedValue(true),
      releaseLock: jest.fn().mockResolvedValue(true),
      pipeline: jest.fn().mockReturnValue({
        set: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      }),
      multi: jest.fn().mockReturnValue({
        decrby: jest.fn(),
        incrby: jest.fn(),
        exec: jest.fn().mockResolvedValue([]),
      }),
      publish: jest.fn().mockResolvedValue(1),
      setnx: jest.fn().mockResolvedValue(true),
      brpop: jest.fn().mockResolvedValue(null),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: REDIS_OPTIONS, useValue: {} },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return PONG for health check', async () => {
    await expect(appController.health()).resolves.toBe('PONG');
  });
});
