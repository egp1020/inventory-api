import { REPORT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Module } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { ReportRepositoryAdapter } from '@reports/infrastructure/adapters';
import {
  GetStockReportUseCase,
  GetAlertsReportUseCase,
  GetMovementHistoryReportUseCase,
} from '@reports/application';
import { ReportsController } from './reports.controller';

@Module({
  controllers: [ReportsController],
  providers: [
    PrismaService,
    ReportRepositoryAdapter,
    {
      provide: REPORT_REPOSITORY,
      useClass: ReportRepositoryAdapter,
    },
    GetStockReportUseCase,
    GetAlertsReportUseCase,
    GetMovementHistoryReportUseCase,
  ],
  exports: [REPORT_REPOSITORY],
})
export class ReportsModule {}
