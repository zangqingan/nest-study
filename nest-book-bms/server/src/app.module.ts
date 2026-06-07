import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './system/modules/user/user.module';
import { BookModule } from './system/modules/book/book.module';
import { JsonReaderModule } from './system/shared/json-reader.module';

import { GlobalPipePipe } from './common/pipe/global-pipe.pipe';

@Module({
  imports: [UserModule, BookModule, JsonReaderModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: GlobalPipePipe }],
})
export class AppModule {}
