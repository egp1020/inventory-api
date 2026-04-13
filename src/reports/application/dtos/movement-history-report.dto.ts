/**
 * Movement History Item DTO
 */
export class MovementHistoryItemDto {
  id: string;
  productSku: string;
  productName: string;
  warehouseName: string;
  type: string;
  quantity: number;
  userName: string;
  notes: string | null;
  createdAt: Date;

  constructor(
    id: string,
    productSku: string,
    productName: string,
    warehouseName: string,
    type: string,
    quantity: number,
    userName: string,
    notes: string | null,
    createdAt: Date,
  ) {
    this.id = id;
    this.productSku = productSku;
    this.productName = productName;
    this.warehouseName = warehouseName;
    this.type = type;
    this.quantity = quantity;
    this.userName = userName;
    this.notes = notes;
    this.createdAt = createdAt;
  }
}

/**
 * Movement History Report Result DTO
 */
export class MovementHistoryReportResultDto {
  data: MovementHistoryItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(
    data: MovementHistoryItemDto[],
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
