import { REPORT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Inject, Injectable } from '@nestjs/common';
import type { IReportRepository } from '@reports/application/ports';
import { MovementHistoryReportResultDto } from '@reports/application/dtos';

/**
 * GetMovementHistoryReportUseCase
 * Gets movement history with optional filters
 */
@Injectable()
export class GetMovementHistoryReportUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
  ) {}

  async execute(
    productId?: string,
    warehouseId?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<MovementHistoryReportResultDto> {
    return this.reportRepository.getMovementHistoryReport(
      productId,
      warehouseId,
      type,
      startDate,
      endDate,
      page,
      limit,
    );
  }
}
