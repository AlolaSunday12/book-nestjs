import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  async createBook(
    @Body() bookDto: CreateBookDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/i, // Case-insensitive
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000, // 1MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<any> {
    return this.bookService.createBook(bookDto, files);
  }

  @Get(':id')
  async getBookId(@Param('id') id: string): Promise<Book> {
    return await this.bookService.findById(id);
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() bookDto: UpdateBookDto,
  ): Promise<Book> {
    if (!Object.keys(bookDto).length) {
      throw new BadRequestException('No fields provided for update');
    }
    const book = await this.bookService.updateById(id, bookDto);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
}
