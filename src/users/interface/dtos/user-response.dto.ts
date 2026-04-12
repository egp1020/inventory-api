import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario',
  })
  id!: string;

  @ApiProperty({
    example: 'operator@warehouse.com',
    description: 'Email del usuario',
  })
  email!: string;

  @ApiProperty({
    example: 'OPERATOR',
    enum: ['ADMIN', 'OPERATOR'],
    description: 'Rol del usuario',
  })
  role!: Role;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de bodega asignada (null si ADMIN)',
    nullable: true,
  })
  warehouseId!: string | null;

  @ApiProperty({
    example: '2026-04-11T17:00:00Z',
    description: 'Fecha de creación',
  })
  createdAt!: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({
    type: [UserResponseDto],
    description: 'Lista de usuarios',
  })
  data!: UserResponseDto[];

  @ApiProperty({
    example: 10,
    description: 'Total de usuarios',
  })
  total!: number;

  @ApiProperty({
    example: 1,
    description: 'Página actual',
  })
  page!: number;

  @ApiProperty({
    example: 10,
    description: 'Límite por página',
  })
  limit!: number;
}
