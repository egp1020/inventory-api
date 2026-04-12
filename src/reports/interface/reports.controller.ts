import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@shared/infrastructure/decorators/roles.decorator';
import {
  GetStockReportUseCase,
  GetAlertsReportUseCase,
  GetMovementHistoryReportUseCase,
} from '@reports/application';
import {
  StockReportResponseDto,
  AlertsReportResponseDto,
  MovementHistoryReportResponseDto,
} from './dtos';

/**
 * ReportsController
 * Handles HTTP requests for inventory reports
 * All endpoints require authentication
 * GetAlertsReport requires ADMIN
 */
@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(
    private readonly getStockReportUseCase: GetStockReportUseCase,
    private readonly getAlertsReportUseCase: GetAlertsReportUseCase,
    private readonly getMovementHistoryReportUseCase: GetMovementHistoryReportUseCase,
  ) {}

  @Get('stock/:warehouseId')
  @ApiOperation({ summary: 'Get stock report for a specific warehouse' })
  @ApiResponse({
    status: 200,
    description: 'Stock report retrieved',
    type: StockReportResponseDto,
  })
  async getStockReport(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
  ): Promise<StockReportResponseDto> {
    const result = await this.getStockReportUseCase.execute(warehouseId);
    return new StockReportResponseDto(result);
  }

  @Get('alerts')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get alerts for low stock products (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Alerts report retrieved',
    type: AlertsReportResponseDto,
  })
  async getAlertsReport(): Promise<AlertsReportResponseDto> {
    const result = await this.getAlertsReportUseCase.execute();
    return new AlertsReportResponseDto(result);
  }

  @Get('movements')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Get movement history with optional filters (ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Movement history report retrieved',
    type: MovementHistoryReportResponseDto,
  })
  async getMovementHistoryReport(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<MovementHistoryReportResponseDto> {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const result = await this.getMovementHistoryReportUseCase.execute(
      productId,
      warehouseId,
      type,
      start,
      end,
      pageNum,
      limitNum,
    );

    return new MovementHistoryReportResponseDto(result);
  }
}
