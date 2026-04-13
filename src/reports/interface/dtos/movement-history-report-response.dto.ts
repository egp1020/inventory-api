import { ApiProperty } from '@nestjs/swagger';
import {
  MovementHistoryItemDto,
  MovementHistoryReportResultDto,
} from '@reports/application/dtos';

/**
 * DTO de Respuesta HTTP para item de movimiento
 */
export class MovementHistoryItemResponseDto {
  @ApiProperty({ example: 'c1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6' })
  id!: string;

  @ApiProperty({ example: 'PROD001' })
  productSku!: string;

  @ApiProperty({ example: 'Laptop' })
  productName!: string;

  @ApiProperty({ example: 'Almacén Central' })
  warehouseName!: string;

  @ApiProperty({ enum: ['ENTRADA', 'SALIDA'] })
  type!: string;

  @ApiProperty({ example: 100 })
  quantity!: number;

  @ApiProperty({ example: 'admin@example.com' })
  userName!: string;

  @ApiProperty({ example: 'Primer lote recibido', nullable: true })
  notes!: string | null;

  @ApiProperty({ example: '2026-04-11T18:00:14.789Z' })
  createdAt!: Date;

  constructor(item: MovementHistoryItemDto) {
    this.id = item.id;
    this.productSku = item.productSku;
    this.productName = item.productName;
    this.warehouseName = item.warehouseName;
    this.type = item.type;
    this.quantity = item.quantity;
    this.userName = item.userName;
    this.notes = item.notes;
    this.createdAt = item.createdAt;
  }
}

/**
 * HTTP Response DTO for movement history report
 */
export class MovementHistoryReportResponseDto {
  @ApiProperty({ type: [MovementHistoryItemResponseDto] })
  data!: MovementHistoryItemResponseDto[];

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 50 })
  total!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;

  constructor(result: MovementHistoryReportResultDto) {
    this.data = result.data.map(
      (m: MovementHistoryItemDto) => new MovementHistoryItemResponseDto(m),
    );
    this.page = result.page;
    this.limit = result.limit;
    this.total = result.total;
    this.totalPages = result.totalPages;
  }
}
