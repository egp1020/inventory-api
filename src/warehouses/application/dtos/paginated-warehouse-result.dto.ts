import { WarehouseResultDto } from './warehouse-result.dto';

/**
 * Result: Contrato de salida para listados paginados de Warehouses
 */
export class PaginatedWarehouseResultDto {
  data: WarehouseResultDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(
    data: WarehouseResultDto[],
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
