import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    example: 'newoperator@warehouse.com',
    description: 'User email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'OPERATOR',
    enum: ['ADMIN', 'OPERATOR'],
    description: 'User role',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ADMIN', 'OPERATOR'])
  role?: Role;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de bodega (null para desasignar)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  warehouseId?: string | null;
}
