import { Inject, Injectable } from '@nestjs/common';
import type { IReportRepository } from '@reports/application/ports';
import { StockReportResultDto } from '@reports/application/dtos';

const REPORT_REPOSITORY = Symbol('REPORT_REPOSITORY');

/**
 * GetStockReportUseCase
 * Gets current stock of all products in a specific warehouse
 */
@Injectable()
export class GetStockReportUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
  ) {}

  async execute(warehouseId: string): Promise<StockReportResultDto> {
    return this.reportRepository.getStockReport(warehouseId);
  }
}
