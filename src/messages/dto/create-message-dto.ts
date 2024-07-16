import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDTO {
  @ApiProperty({
    example: '668c1d1d2d4d44d7a3cb7b73',
    required: true,
  })
  receiver: string;
  @ApiProperty({
    example: 'Hello',
    required: true,
  })
  text: string;
}
