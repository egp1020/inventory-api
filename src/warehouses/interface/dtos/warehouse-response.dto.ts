import { ApiProperty } from '@nestjs/swagger';
import { WarehouseResultDto } from '@warehouses/application/dtos';

/**
 * HTTP Response DTO
 * Transforma WarehouseResultDto a respuesta HTTP con Swagger docs
 */
export class WarehouseResponseDto {
  @ApiProperty({
    description: 'Warehouse unique identifier',
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  id: string;

  @ApiProperty({
    description: 'Warehouse name',
    example: 'Main Warehouse',
  })
  name: string;

  @ApiProperty({
    description: 'Warehouse location',
    example: 'Madrid, Spain',
  })
  location: string;

  @ApiProperty({
    description: 'Maximum capacity in units',
    example: 5000,
  })
  capacity: number;

  @ApiProperty({
    description: 'Is warehouse active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Warehouse creation timestamp',
    example: '2026-04-11T17:40:31.187Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Soft delete timestamp',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(dto: WarehouseResultDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.location = dto.location;
    this.capacity = dto.capacity;
    this.isActive = dto.isActive;
    this.createdAt = dto.createdAt;
    this.deletedAt = dto.deletedAt;
  }
}
