import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, IsOptional, IsUUID, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'operator@warehouse.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePass123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'OPERATOR',
    enum: ['ADMIN', 'OPERATOR'],
    description: 'Rol del usuario',
  })
  @IsEnum(['ADMIN', 'OPERATOR'])
  role!: Role;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de bodega (requerido si role es OPERATOR)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;
}
