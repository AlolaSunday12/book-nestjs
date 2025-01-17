import { Body, Controller, Get, Post } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll()
  }

  @Post()
  async Create(
    @Body()
    book: CreateBookDto,
  ): Promise<Book> {
    return await this.bookService.createBook(book);
  }
}
