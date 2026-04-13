import { ApiProperty } from '@nestjs/swagger';
import { WarehouseResponseDto } from './warehouse-response.dto';

/**
 * DTO de Respuesta HTTP for paginated list
 */
export class PaginatedWarehouseResponseDto {
  @ApiProperty({
    description: 'Array of warehouses',
    type: [WarehouseResponseDto],
  })
  data: WarehouseResponseDto[];

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
    description: 'Total number of warehouses',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;

  constructor(
    data: WarehouseResponseDto[],
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
