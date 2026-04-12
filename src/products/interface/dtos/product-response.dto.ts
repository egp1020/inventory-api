import { ApiProperty } from '@nestjs/swagger';
import { ProductResultDto } from '@products/application/dtos';

/**
 * HTTP Response DTO
 * Transforma ProductResultDto a respuesta HTTP con Swagger docs
 */
export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  id: string;

  @ApiProperty({
    description: 'Product SKU',
    example: 'PROD001',
  })
  sku: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'units',
  })
  unit: string;

  @ApiProperty({
    description: 'Minimum stock alert',
    example: 10,
  })
  minStockAlert: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2026-04-11T17:52:28.454Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Soft delete timestamp',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;

  constructor(dto: ProductResultDto) {
    this.id = dto.id;
    this.sku = dto.sku;
    this.name = dto.name;
    this.description = dto.description;
    this.unit = dto.unit;
    this.minStockAlert = dto.minStockAlert;
    this.createdAt = dto.createdAt;
    this.deletedAt = dto.deletedAt;
  }
}
