import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly confirmPassword: string;
}
