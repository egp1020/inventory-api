import { IsString, IsInt, Min, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Solicitud HTTP
 * Valida y transforma entrada HTTP para UpdateProductCommandDto
 */
export class UpdateProductRequestDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Updated Laptop',
    required: false,
  })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Updated description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Unidad de medida',
    example: 'units',
    required: false,
  })
  @IsString()
  @Length(1, 50)
  @IsOptional()
  unit?: string;

  @ApiProperty({
    description: 'Umbral mínimo de alerta de stock',
    example: 15,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  minStockAlert?: number;
}
