import { Category } from '../schemas/book.schema';

export class CreateBookDto{
  title: string;
  description: string;
  author: string;
  price: number;
  category: Category
  image: string;
}