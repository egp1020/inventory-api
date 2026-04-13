import { IsString, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@movements/domain';

/**
 * DTO de Solicitud HTTP para registrar movimiento
 */
export class RegisterMovementRequestDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'ID de bodega',
    example: 'b1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  @IsString()
  warehouseId!: string;

  @ApiProperty({
    description: 'Movement type (ENTRADA: income, SALIDA: outcome)',
    enum: ['ENTRADA', 'SALIDA'],
    example: 'ENTRADA',
  })
  @IsEnum(MovementType)
  type!: MovementType;

  @ApiProperty({
    description: 'Cantidad a mover',
    example: 100,
  })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Optional notes about the movement',
    example: 'First batch received',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
