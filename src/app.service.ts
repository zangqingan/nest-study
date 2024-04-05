import { Injectable, Logger, Inject } from '@nestjs/common';
// 使用redis
import { RedisClientType } from 'redis';
@Injectable()
export class AppService {
  private logger = new Logger();
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getHello(): Promise<string> {
    this.logger.debug('aaa', AppService.name);
    this.logger.error('bbb', AppService.name);
    this.logger.log('ccc', AppService.name);
    this.logger.verbose('ddd', AppService.name);
    this.logger.warn('eee', AppService.name);
    const value = await this.redisClient.keys('*');
    await this.redisClient.set('newName', 'zhangsan');
    const value2 = await this.redisClient.get('newName');
    console.log(value);
    console.log(value2);
    return 'Hello World111!';
  }
  create(): string {
    return 'createUser';
  }
  getUser(): string {
    return 'getUser';
  }
  update(): string {
    return 'update';
  }
}
