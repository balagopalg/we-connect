import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '668ca540c54d5823a5fa8c3f',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: {
      displayName: 'Balagopal',
      gender: 'Male',
      birthday: '1993-11-14',
    },
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AboutDto)
  about: AboutDto;

  @ApiProperty({
    example: {
      category: ['cricket', 'movies'],
    },
    required: false,
  })
  @ValidateNested()
  @Type(() => InterestDto)
  @IsNotEmpty()
  interests: InterestDto;
}
