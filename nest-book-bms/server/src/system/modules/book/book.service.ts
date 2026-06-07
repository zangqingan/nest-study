import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { JsonReaderService } from '../../shared/json-reader.service';
@Injectable()
export class BookService {
  constructor(private readonly jsonReaderService: JsonReaderService) {}
  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.jsonReaderService.readJsonFile();
    const lastBook = books[books.length - 1];
    const newBook: Book = {
      id: lastBook.id + 1,
      ...createBookDto,
    };
    books.push(newBook);
    await this.jsonReaderService.writeJsonFile(books);
    return {
      message: '添加书籍成功',
      data: newBook,
    };
  }

  async findAll(title: string) {
    const books: Book[] = await this.jsonReaderService.readJsonFile();
    const filteredBooks = books.filter((b) => b.title.includes(title));
    const result = title ? filteredBooks : books;
    return {
      message: '获取书籍列表成功',
      data: result,
    };
  }

  async findOne(id: number) {
    const books: Book[] = await this.jsonReaderService.readJsonFile();
    const book = books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException('书籍未找到');
    }
    return {
      message: '获取书籍详情成功',
      data: book,
    };
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.jsonReaderService.readJsonFile();
    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException('书籍未找到');
    }
    Object.assign(books[bookIndex], updateBookDto);
    await this.jsonReaderService.writeJsonFile(books);
    return {
      message: '更新书籍成功',
      data: books[bookIndex],
    };
  }

  async remove(id: number) {
    const books: Book[] = await this.jsonReaderService.readJsonFile();
    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      throw new NotFoundException('书籍未找到');
    }
    const deletedBook = books.splice(bookIndex, 1);
    await this.jsonReaderService.writeJsonFile(books);
    return {
      message: '删除书籍成功',
      data: deletedBook,
    };
  }

  // 上传图书封面
  async upload(file: Express.Multer.File) {
    console.log(file); // 这里可以实现上传逻辑，例如使用 Multer 中间件处理文件上传
    //
    return {
      message: '上传图书封面成功',
      data: { ...file, link: `/uploads/${file.filename}` },
    };
  }
}
