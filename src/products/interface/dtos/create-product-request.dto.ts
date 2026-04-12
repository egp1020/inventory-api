import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP Request DTO
 * Valida y transforma entrada HTTP para CreateProductCommandDto
 */
export class CreateProductRequestDto {
  @ApiProperty({
    description: 'Product SKU (uppercase letters, numbers, hyphens: 4-20 chars)',
    example: 'PROD001',
  })
  @IsString()
  @Length(4, 20)
  sku!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Computer',
  })
  @IsString()
  @Length(1, 255)
  name!: string;

  @ApiProperty({
    description: 'Product description',
    example: 'High-performance laptop',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'units',
  })
  @IsString()
  @Length(1, 50)
  unit!: string;

  @ApiProperty({
    description: 'Minimum stock alert threshold',
    example: 10,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;
}
