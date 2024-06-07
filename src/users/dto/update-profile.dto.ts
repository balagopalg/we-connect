import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { AboutDto, InterestDto } from './create-profile.dto';

export class UpdateProfileDTO {
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
