import { IsString, IsInt, Min, Max, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Solicitud HTTP
 * Valida y transforma entrada HTTP para UpdateWarehouseCommandDto
 */
export class UpdateWarehouseRequestDto {
  @ApiProperty({
    description: 'Nombre de la bodega',
    example: 'Updated Warehouse Name',
    required: false,
  })
  @IsString()
  @Length(1, 100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Ubicación de la bodega',
    example: 'Barcelona, Spain',
    required: false,
  })
  @IsString()
  @Length(1, 200)
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Capacidad máxima en unidades',
    example: 10000,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  @IsOptional()
  capacity?: number;
}
