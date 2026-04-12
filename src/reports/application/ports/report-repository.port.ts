import {
  StockReportResultDto,
  AlertsReportResultDto,
  MovementHistoryReportResultDto,
} from '@reports/application/dtos';

/**
 * IReportRepository
 * Puerto que define el contrato para generar reportes
 * Implementado en infrastructure
 */
export interface IReportRepository {
  /**
   * Genera reporte de stock actual en una bodega
   */
  getStockReport(warehouseId: string): Promise<StockReportResultDto>;

  /**
   * Genera reporte de alertas de stock bajo
   */
  getAlertsReport(): Promise<AlertsReportResultDto>;

  /**
   * Genera reporte de histórico de movimientos
   */
  getMovementHistoryReport(
    productId?: string,
    warehouseId?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
  ): Promise<MovementHistoryReportResultDto>;
}
