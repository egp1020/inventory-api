import { IsString, IsInt, Min, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de Solicitud HTTP
 * Valida y transforma entrada HTTP para CreateWarehouseCommandDto
 */
export class CreateWarehouseRequestDto {
  @ApiProperty({
    description: 'Nombre de la bodega',
    example: 'Main Warehouse',
  })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    description: 'Ubicación de la bodega',
    example: 'Madrid, Spain',
  })
  @IsString()
  @Length(1, 200)
  location!: string;

  @ApiProperty({
    description: 'Capacidad máxima en unidades',
    example: 5000,
  })
  @IsInt()
  @Min(1)
  @Max(1000000)
  capacity!: number;
}
