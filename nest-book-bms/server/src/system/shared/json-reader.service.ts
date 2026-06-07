import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { access, readFile, writeFile } from 'fs/promises';
import type { JsonReaderOptions } from './json-reader.module';

@Injectable()
export class JsonReaderService {
  // 注入模块选项
  @Inject('JSON_READER_OPTIONS')
  private options!: JsonReaderOptions;

  // 读取JSON文件
  async readJsonFile() {
    const filePath = this.options.filePath;
    // 增加路径是否存在判断
    try {
      await access(filePath);
    } catch (error) {
      throw new BadRequestException('JSON文件不存在');
    }
    // 实现读取JSON文件的逻辑
    const jsonData = await readFile(filePath, 'utf-8');
    if (!jsonData) {
      throw new BadRequestException('JSON文件内容为空');
    }
    return JSON.parse(jsonData);
  }

  // 写入JSON文件
  async writeJsonFile(data: any) {
    // 实现写入JSON文件的逻辑
    await writeFile(
      this.options.filePath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  }
}
