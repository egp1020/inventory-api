/**
 * Stock Report Item DTO
 */
export class StockReportItemDto {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  minStockAlert: number;

  constructor(
    productId: string,
    sku: string,
    productName: string,
    quantity: number,
    minStockAlert: number,
  ) {
    this.productId = productId;
    this.sku = sku;
    this.productName = productName;
    this.quantity = quantity;
    this.minStockAlert = minStockAlert;
  }

  get isLowStock(): boolean {
    return this.quantity < this.minStockAlert;
  }
}

/**
 * Stock Report Result DTO
 */
export class StockReportResultDto {
  warehouseId: string;
  warehouseName: string;
  items: StockReportItemDto[];
  totalProducts: number;
  lowStockCount: number;

  constructor(
    warehouseId: string,
    warehouseName: string,
    items: StockReportItemDto[],
  ) {
    this.warehouseId = warehouseId;
    this.warehouseName = warehouseName;
    this.items = items;
    this.totalProducts = items.length;
    this.lowStockCount = items.filter((item) => item.isLowStock).length;
  }
}
