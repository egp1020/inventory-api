import { REPORT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Inject, Injectable } from '@nestjs/common';
import type { IReportRepository } from '@reports/application/ports';
import { StockReportResultDto } from '@reports/application/dtos';

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
