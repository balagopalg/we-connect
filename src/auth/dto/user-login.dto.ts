import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginDTO {
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
  readonly password: string;
}
