import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'User email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
