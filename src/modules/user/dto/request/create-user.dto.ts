import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  // @IsInt()
  // @Min(16)
  // @Max(99)
  @IsString()
  age: number;

  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  city: string;
}
