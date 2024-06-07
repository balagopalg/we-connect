import { IsString, IsNotEmpty } from 'class-validator';

export class ViewProfileDTO {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}
