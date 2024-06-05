import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  readonly imageUrl: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;

  @IsString()
  @IsNotEmpty()
  readonly dob: string;

  @IsString()
  readonly horoscopr: string;

  @IsString()
  readonly zodiac: string;

  @IsString()
  readonly height: string;

  @IsString()
  readonly weight: string;
}
