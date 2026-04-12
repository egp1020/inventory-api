import { Inject, Injectable } from '@nestjs/common';
import type { IReportRepository } from '@reports/application/ports';
import { AlertsReportResultDto } from '@reports/application/dtos';

const REPORT_REPOSITORY = Symbol('REPORT_REPOSITORY');

/**
 * GetAlertsReportUseCase
 * Gets alert report of products with low stock
 */
@Injectable()
export class GetAlertsReportUseCase {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
  ) {}

  async execute(): Promise<AlertsReportResultDto> {
    return this.reportRepository.getAlertsReport();
  }
}
