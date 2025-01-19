import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
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
  @UseInterceptors(FilesInterceptor('file', 10, multerConfig))
  async updateById(
    @Param('id') id: string,
    @Body() bookDto: UpdateBookDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<Book> {
    if (!Object.keys(bookDto).length && (!files || files.length === 0)) {
      throw new BadRequestException('No fields provided for update');
    }

    const basePath = `${req.protocol}://${req.get('host')}/Public/uploads/`;

    let imagesPaths: string[] = [];
    if (files && files.length > 0) {
      imagesPaths = files.map((file) => `${basePath}${file.filename}`);
      bookDto.images = imagesPaths;
    }

    const book = await this.bookService.updateById(id, bookDto);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string
  ): Promise<Book> {
    const book = await this.bookService.deleteBook(id);

    if (!book) {
      throw new NotFoundException('Book not found for deletion');
    }
    return book;
  }
}
