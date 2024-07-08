import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
