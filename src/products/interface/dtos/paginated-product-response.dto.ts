import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

/**
 * HTTP Response DTO for paginated list
 */
export class PaginatedProductResponseDto {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponseDto],
  })
  data: ProductResponseDto[];

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
    description: 'Total number of products',
    example: 25,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3,
  })
  totalPages: number;

  constructor(
    data: ProductResponseDto[],
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
