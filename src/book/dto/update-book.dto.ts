import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/book.schema';
import { Transform } from 'class-transformer';
import { User } from '../../auth/schemas/user.schema';

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

  @IsEmpty({ message: 'You can not pass user Id.' })
  readonly user: User;
}
