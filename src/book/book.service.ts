import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    const books = await this.bookModel.find();
    return books;
  }

  async createBook(
    bookDto: CreateBookDto,
    files: Array<Express.Multer.File>,
  ): Promise<Book> {
    const imageUrls = files.map((file) => {
      return `http://localhost:3000/uploads/${file.filename}`;
    });

    // Create the book with the DTO and the uploaded image URLs
    const book = new this.bookModel({
      ...bookDto,
      images: imageUrls, // Assuming the schema has an "images" field
    });
    console.log('Book to be saved:', book);

    return await book.save();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async updateById(id: string, bookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(id, bookDto, {
      new: true,
      runValidators: true,
    });
    return book;
  }

  async deleteBook(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
