import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import * as mongoose from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: ExpressQuery): Promise<Book[]> {
    // pagination
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);

    // Check if no books are found
    if (books.length === 0) {
      throw new NotFoundException('No books available for the requested page.');
    }
    return books;
  }

  async createBook(
    bookDto: CreateBookDto,
    user: User,
    files: Array<Express.Multer.File>,
  ): Promise<Book> {
    const imageUrls = files.map((file) => {
      return `http://localhost:3000/uploads/${file.filename}`;
    });

    // Create the book with the DTO and the uploaded image URLs
    const book = new this.bookModel({
      ...bookDto,
      images: imageUrls,
      user: user._id,
    });
    console.log('Book to be saved:', book);

    return await book.save();
  }

  async findById(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('please enter coreect Id');
    }
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

  // Delete book by Id
  async deleteBook(id: string): Promise<Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
