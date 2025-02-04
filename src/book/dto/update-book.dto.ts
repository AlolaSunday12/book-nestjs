import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { Transform } from 'class-transformer';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please type correct Category.' })
  category?: Category;

  @IsOptional()
  @IsString({ each: true }) // Ensures all items in the array are strings
  images?: string[];
}
