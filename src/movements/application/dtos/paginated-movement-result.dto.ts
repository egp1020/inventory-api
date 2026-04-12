/**
 * ResultDto para listado paginado de movimientos
 */
export class PaginatedMovementResultDto {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}
