import { ApiProperty } from '@nestjs/swagger';
import { MovementResponseDto } from './movement-response.dto';

/**
 * DTO de Respuesta HTTP para listado paginado de movimientos
 */
export class PaginatedMovementResponseDto {
  @ApiProperty({
    description: 'Array of movements',
    type: [MovementResponseDto],
  })
  data: MovementResponseDto[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of movements',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;

  constructor(
    data: MovementResponseDto[],
    page: number,
    limit: number,
    total: number,
    totalPages: number,
  ) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
  }
}
