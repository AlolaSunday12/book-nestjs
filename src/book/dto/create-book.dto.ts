import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/book.schema';
import { Transform } from 'class-transformer';
import { User } from '../../auth/schemas/user.schema';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please type correct Category.' })
  category: Category;

  @IsOptional()
  @IsString()
  @IsArray()
  images: string[];

  @IsEmpty({ message: 'You can not pass user Id.' })
  readonly user: User;
}
