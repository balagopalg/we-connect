import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class AboutDto {
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  gender: string;

  @IsDateString()
  birthday: string;

  @IsOptional()
  @IsString()
  horoscope?: string;

  @IsOptional()
  @IsString()
  zodiac?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;
}

export class InterestDto {
  category: string[];
}

export class CreateProfileDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AboutDto)
  about: AboutDto;

  @ValidateNested()
  @Type(() => InterestDto)
  @IsNotEmpty()
  interests: InterestDto;
}
