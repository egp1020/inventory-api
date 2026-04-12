/**
 * Alert Report: Productos bajo stock mínimo en cualquier bodega
 */
export class AlertItemDto {
  productId: string;
  sku: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  minStockAlert: number;
  stockDeficit: number;

  constructor(
    productId: string,
    sku: string,
    productName: string,
    warehouseId: string,
    warehouseName: string,
    currentStock: number,
    minStockAlert: number,
  ) {
    this.productId = productId;
    this.sku = sku;
    this.productName = productName;
    this.warehouseId = warehouseId;
    this.warehouseName = warehouseName;
    this.currentStock = currentStock;
    this.minStockAlert = minStockAlert;
    this.stockDeficit = minStockAlert - currentStock;
  }
}

export class AlertsReportResultDto {
  alerts: AlertItemDto[];
  totalAlerts: number;
  criticalCount: number; // stock < 10% of minStockAlert

  constructor(alerts: AlertItemDto[]) {
    this.alerts = alerts.sort((a, b) => b.stockDeficit - a.stockDeficit); // Ordenar por déficit descendente
    this.totalAlerts = alerts.length;
    this.criticalCount = alerts.filter(
      (a) => a.currentStock < a.minStockAlert * 0.1,
    ).length;
  }
}
