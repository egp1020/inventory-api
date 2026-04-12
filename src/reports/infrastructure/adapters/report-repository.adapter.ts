import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { IReportRepository } from '@reports/application/ports';
import {
  StockReportItemDto,
  StockReportResultDto,
  AlertItemDto,
  AlertsReportResultDto,
  MovementHistoryItemDto,
  MovementHistoryReportResultDto,
} from '@reports/application/dtos';

/**
 * ReportRepositoryAdapter
 * Implementa IReportRepository usando Prisma para queries de lectura
 */
@Injectable()
export class ReportRepositoryAdapter implements IReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStockReport(warehouseId: string): Promise<StockReportResultDto> {
    // Get datos de la bodega
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId, deletedAt: null },
    });

    if (!warehouse) {
      throw new Error(`Warehouse ${warehouseId} not found`);
    }

    // Get todos los productos activos
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
    });

    // For each producto, calcular el stock en la bodega
    const items: StockReportItemDto[] = [];

    for (const product of products) {
      const entries = await this.prisma.stockMovement.aggregate({
        where: {
          productId: product.id,
          warehouseId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: 'ENTRADA' as any,
        },
        _sum: { quantity: true },
      });

      const exits = await this.prisma.stockMovement.aggregate({
        where: {
          productId: product.id,
          warehouseId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: 'SALIDA' as any,
        },
        _sum: { quantity: true },
      });

      const quantity =
        (entries._sum.quantity || 0) - (exits._sum.quantity || 0);

      items.push(
        new StockReportItemDto(
          product.id,
          product.sku,
          product.name,
          Math.max(0, quantity),
          product.minStockAlert,
        ),
      );
    }

    return new StockReportResultDto(warehouse.id, warehouse.name, items);
  }

  async getAlertsReport(): Promise<AlertsReportResultDto> {
    // Get todos los productos con stock bajo
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
    });

    const alerts: AlertItemDto[] = [];

    for (const product of products) {
      // Get todas las bodegas
      const warehouses = await this.prisma.warehouse.findMany({
        where: { deletedAt: null },
      });

      for (const warehouse of warehouses) {
        const entries = await this.prisma.stockMovement.aggregate({
          where: {
            productId: product.id,
            warehouseId: warehouse.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: 'ENTRADA' as any,
          },
          _sum: { quantity: true },
        });

        const exits = await this.prisma.stockMovement.aggregate({
          where: {
            productId: product.id,
            warehouseId: warehouse.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: 'SALIDA' as any,
          },
          _sum: { quantity: true },
        });

        const currentStock =
          (entries._sum.quantity || 0) - (exits._sum.quantity || 0);

        // If stock is low, add to alerts
        if (currentStock < product.minStockAlert) {
          alerts.push(
            new AlertItemDto(
              product.id,
              product.sku,
              product.name,
              warehouse.id,
              warehouse.name,
              Math.max(0, currentStock),
              product.minStockAlert,
            ),
          );
        }
      }
    }

    return new AlertsReportResultDto(alerts);
  }

  async getMovementHistoryReport(
    productId?: string,
    warehouseId?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<MovementHistoryReportResultDto> {
    const where: any = {};

    if (productId) {
      where.productId = productId;
    }
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    if (type) {
      where.type = type as any;
    }
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    } else if (startDate) {
      where.createdAt = { gte: startDate };
    } else if (endDate) {
      where.createdAt = { lte: endDate };
    }

    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        include: { product: true, warehouse: true, user: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    const data = movements.map(
      (m) =>
        new MovementHistoryItemDto(
          m.id,
          m.product.sku,
          m.product.name,
          m.warehouse.name,
          m.type,
          m.quantity,
          m.user.email,
          m.notes,
          m.createdAt,
        ),
    );

    return new MovementHistoryReportResultDto(
      data,
      total,
      page,
      limit,
      Math.ceil(total / limit),
    );
  }
}
