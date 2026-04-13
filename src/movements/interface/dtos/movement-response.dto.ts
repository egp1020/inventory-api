import { ApiProperty } from '@nestjs/swagger';
import { MovementResultDto } from '@movements/application/dtos';

/**
 * DTO de Respuesta HTTP para movimiento
 */
export class MovementResponseDto {
  @ApiProperty({
    description: 'Movement unique identifier',
    example: 'c1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  id: string;

  @ApiProperty({
    description: 'ID del producto',
    example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  productId: string;

  @ApiProperty({
    description: 'ID de bodega',
    example: 'b1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  warehouseId: string;

  @ApiProperty({
    description: 'User ID who registered the movement',
    example: 'd1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6',
  })
  userId: string;

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: ['ENTRADA', 'SALIDA'],
    example: 'ENTRADA',
  })
  type: string;

  @ApiProperty({
    description: 'Quantity moved',
    example: 100,
  })
  quantity: number;

  @ApiProperty({
    description: 'Notas del movimiento',
    example: 'First batch',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: 'Movement creation timestamp',
    example: '2026-04-11T18:00:14.789Z',
  })
  createdAt: Date;

  constructor(dto: MovementResultDto) {
    this.id = dto.id;
    this.productId = dto.productId;
    this.warehouseId = dto.warehouseId;
    this.userId = dto.userId;
    this.type = dto.type;
    this.quantity = dto.quantity;
    this.notes = dto.notes;
    this.createdAt = dto.createdAt;
  }
}
