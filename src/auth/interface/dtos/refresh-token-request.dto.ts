import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsJWT } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    description: 'Refresh token válido',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsJWT()
  refreshToken!: string;
}
