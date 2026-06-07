import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { JsonReaderModule } from '../../shared/json-reader.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [JsonReaderModule.register({ filePath: 'src/common/book.json' })],
})
export class BookModule {}
