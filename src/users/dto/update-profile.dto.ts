import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { AboutDto, InterestDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDTO {
  @ApiProperty({
    example: '668ca540c54d5823a5fa8c3f',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId?: string;

  @ApiProperty({
    example: {
      displayName: 'Balagopal G',
      gender: 'Male',
      birthday: '1997-04-19',
    },
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AboutDto)
  about: AboutDto;

  @ApiProperty({
    example: {
      category: ['cricket', 'movies', 'music'],
    },
    required: false,
  })
  @ValidateNested()
  @Type(() => InterestDto)
  @IsNotEmpty()
  interests?: InterestDto;
}
