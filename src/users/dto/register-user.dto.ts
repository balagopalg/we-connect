import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    example: 'user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly username?: string;

  @ApiProperty({
    example: 'user@gmail.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'Abcd123@',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly password: string;

  @ApiProperty({
    example: 'Abcd123@',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(14)
  readonly confirmPassword: string;
}
