import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
// import { Logger as WinstonLogger } from 'winston';

@Controller()
export class AppController {
  private readonly logger = new Logger();
  // @Inject(WINSTON_MODULE_PROVIDER)
  // private readonly winstonLogger;
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    this.logger.debug('aaa', AppController.name);
    this.logger.error('bbb', AppController.name);
    this.logger.log('ccc', AppController.name);
    this.logger.verbose('ddd', AppController.name);
    this.logger.warn('eee', AppController.name);
    // 带上下文的日志
    // this.winstonLogger.info('AppController getHello method', {
    //   context: 'AppController',
    //   email: "test@example.com"
    // });
    return this.appService.getHello();
  }
}
