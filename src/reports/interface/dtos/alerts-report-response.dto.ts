import { ApiProperty } from '@nestjs/swagger';
import { AlertItemDto, AlertsReportResultDto } from '@reports/application/dtos';

/**
 * DTO de Respuesta HTTP para item de alerta
 */
export class AlertItemResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6' })
  productId!: string;

  @ApiProperty({ example: 'PROD001' })
  sku!: string;

  @ApiProperty({ example: 'Laptop' })
  productName!: string;

  @ApiProperty({ example: 'b1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6' })
  warehouseId!: string;

  @ApiProperty({ example: 'Almacén Central' })
  warehouseName!: string;

  @ApiProperty({ example: 5 })
  currentStock!: number;

  @ApiProperty({ example: 50 })
  minStockAlert!: number;

  @ApiProperty({ example: 45, description: 'Quantity to reach minimum' })
  stockDeficit!: number;

  constructor(item: AlertItemDto) {
    this.productId = item.productId;
    this.sku = item.sku;
    this.productName = item.productName;
    this.warehouseId = item.warehouseId;
    this.warehouseName = item.warehouseName;
    this.currentStock = item.currentStock;
    this.minStockAlert = item.minStockAlert;
    this.stockDeficit = item.stockDeficit;
  }
}

/**
 * DTO de Respuesta HTTP para reporte de alertas
 */
export class AlertsReportResponseDto {
  @ApiProperty({ type: [AlertItemResponseDto] })
  alerts!: AlertItemResponseDto[];

  @ApiProperty({ example: 5 })
  totalAlerts!: number;

  @ApiProperty({
    example: 1,
    description: 'Critical alerts (stock < 10% of minimum)',
  })
  criticalCount!: number;

  constructor(result: AlertsReportResultDto) {
    this.alerts = result.alerts.map(
      (a: AlertItemDto) => new AlertItemResponseDto(a),
    );
    this.totalAlerts = result.totalAlerts;
    this.criticalCount = result.criticalCount;
  }
}
