import { ApiProperty } from '@nestjs/swagger';
import {
  StockReportItemDto,
  StockReportResultDto,
} from '@reports/application/dtos';

/**
 * HTTP Response DTO para item de stock
 */
export class StockReportItemResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6' })
  productId!: string;

  @ApiProperty({ example: 'PROD001' })
  sku!: string;

  @ApiProperty({ example: 'Laptop' })
  productName!: string;

  @ApiProperty({ example: 150 })
  quantity!: number;

  @ApiProperty({ example: 50 })
  minStockAlert!: number;

  @ApiProperty({ example: false })
  isLowStock!: boolean;

  constructor(item: StockReportItemDto) {
    this.productId = item.productId;
    this.sku = item.sku;
    this.productName = item.productName;
    this.quantity = item.quantity;
    this.minStockAlert = item.minStockAlert;
    this.isLowStock = item.isLowStock;
  }
}

/**
 * HTTP Response DTO para reporte de stock
 */
export class StockReportResponseDto {
  @ApiProperty({ example: 'b1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6' })
  warehouseId!: string;

  @ApiProperty({ example: 'Almacén Central' })
  warehouseName!: string;

  @ApiProperty({ type: [StockReportItemResponseDto] })
  items!: StockReportItemResponseDto[];

  @ApiProperty({ example: 25 })
  totalProducts!: number;

  @ApiProperty({ example: 3 })
  lowStockCount!: number;

  constructor(result: StockReportResultDto) {
    this.warehouseId = result.warehouseId;
    this.warehouseName = result.warehouseName;
    this.items = result.items.map((i) => new StockReportItemResponseDto(i));
    this.totalProducts = result.totalProducts;
    this.lowStockCount = result.lowStockCount;
  }
}
