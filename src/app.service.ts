import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private logger = new Logger();
  getHello(): string {
    this.logger.debug('aaa', AppService.name);
    this.logger.error('bbb', AppService.name);
    this.logger.log('ccc', AppService.name);
    this.logger.verbose('ddd', AppService.name);
    this.logger.warn('eee', AppService.name);
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
