import { IsString, IsEnum, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@movements/domain';

/**
 * HTTP Request DTO para registrar movimiento
 */
export class RegisterMovementRequestDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    description: 'Warehouse ID',
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
    description: 'Quantity to move',
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
