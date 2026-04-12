import { ProductResultDto } from './product-result.dto';

/**
 * Result: Contrato de salida para listados paginados de Products
 */
export class PaginatedProductResultDto {
  data: ProductResultDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(
    data: ProductResultDto[],
    page: number,
    limit: number,
    total: number,
  ) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }
}
