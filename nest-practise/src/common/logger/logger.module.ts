import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerOptions } from 'winston';
import { MyLogger } from './customLogger';

// 定义一个提供者名字
export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class CustomWinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: CustomWinstonModule,
      // 把 MyLogger 作为值提供者提供出去
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
