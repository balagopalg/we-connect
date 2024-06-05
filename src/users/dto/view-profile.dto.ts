import { IsString, IsNotEmpty } from 'class-validator';

export class ViewProfileDTO {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
