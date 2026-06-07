import { DynamicModule, Module } from '@nestjs/common';
import { JsonReaderService } from './json-reader.service';

// 定义模块选项接口
export interface JsonReaderOptions {
  filePath: string;
}

@Module({})
export class JsonReaderModule {
  static register(options: JsonReaderOptions): DynamicModule {
    return {
      module: JsonReaderModule,
      providers: [
        {
          provide: 'JSON_READER_OPTIONS',
          useValue: options,
        },
        JsonReaderService,
      ],
      exports: [JsonReaderService],
    };
  }
}
