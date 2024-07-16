import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ViewProfileDTO {
  @ApiProperty({
    example: '668ca540c54d5823a5fa8c3f',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly userId?: string;
}
