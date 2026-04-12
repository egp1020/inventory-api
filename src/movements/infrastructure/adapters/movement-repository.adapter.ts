import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { Movement, MovementType } from '@movements/domain';
import { IMovementRepository } from '@movements/domain/ports';
import {
  ProductNotFoundForMovementError,
  WarehouseNotFoundForMovementError,
  UserNotFoundForMovementError,
  UnauthorizedMovementError,
  InsufficientStockError,
} from '@movements/domain/errors';

/**
 * MovementRepositoryAdapter
 * Implementa IMovementRepository usando Prisma
 * Maneja transacciones para operaciones críticas
 * También valida existencia de recursos (productos, bodegas, usuarios)
 */
@Injectable()
export class MovementRepositoryAdapter implements IMovementRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Guarda un movimiento con validaciones previas
   * Usa transacción para atomicidad
   */
  async save(
    movement: Movement,
    validateExistence: boolean = true,
  ): Promise<void> {
    if (validateExistence) {
      // Validar que el producto existe
      const product = await this.prisma.product.findUnique({
        where: { id: movement.getProductId() },
      });
      if (!product) {
        throw new ProductNotFoundForMovementError(movement.getProductId());
      }

      // Validar que la bodega existe
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: movement.getWarehouseId() },
      });
      if (!warehouse) {
        throw new WarehouseNotFoundForMovementError(movement.getWarehouseId());
      }

      // Validar que el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { id: movement.getUserId() },
      });
      if (!user) {
        throw new UserNotFoundForMovementError(movement.getUserId());
      }

      // Si es OPERATOR, validar que está asignado a esta bodega
      if (
        user.role === 'OPERATOR' &&
        user.warehouseId !== movement.getWarehouseId()
      ) {
        throw new UnauthorizedMovementError(
          movement.getUserId(),
          movement.getWarehouseId(),
        );
      }

      // Si es SALIDA, validar stock disponible
      if (movement.isExit()) {
        const currentStock = await this.getStockByProductAndWarehouse(
          movement.getProductId(),
          movement.getWarehouseId(),
        );

        if (currentStock < movement.getQuantityValue()) {
          throw new InsufficientStockError(
            movement.getProductId(),
            movement.getWarehouseId(),
            currentStock,
            movement.getQuantityValue(),
          );
        }
      }
    }

    const data = {
      id: movement.getId(),
      productId: movement.getProductId(),
      warehouseId: movement.getWarehouseId(),
      userId: movement.getUserId(),
      type: movement.getTypeValue() as any, // Cast para hacer match con enum de Prisma
      quantity: movement.getQuantityValue(),
      notes: movement.getNotes(),
      createdAt: movement.getCreatedAt(),
    };

    // Usar transacción para asegurar atomicidad
    await this.prisma.$transaction(async (prisma) => {
      await prisma.stockMovement.create({ data });
    });
  }

  async findById(id: string): Promise<Movement | null> {
    const raw = await this.prisma.stockMovement.findUnique({
      where: { id },
    });

    if (!raw) {
      return null;
    }

    return Movement.restore(
      raw.id,
      raw.productId,
      raw.warehouseId,
      raw.userId,
      raw.type,
      raw.quantity,
      raw.notes,
      raw.createdAt,
    );
  }

  async getStockByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number> {
    const entries = await this.prisma.stockMovement.aggregate({
      where: {
        productId,
        warehouseId,
        type: 'ENTRADA' as any,
      },
      _sum: {
        quantity: true,
      },
    });

    const exits = await this.prisma.stockMovement.aggregate({
      where: {
        productId,
        warehouseId,
        type: 'SALIDA' as any,
      },
      _sum: {
        quantity: true,
      },
    });

    const entryQuantity = entries._sum.quantity || 0;
    const exitQuantity = exits._sum.quantity || 0;

    return entryQuantity - exitQuantity;
  }

  async listMovements(
    productId?: string,
    warehouseId?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Movement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
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
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    } else if (endDate) {
      where.createdAt = {
        lte: endDate,
      };
    }

    const skip = (page - 1) * limit;

    const [raw, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    const data = raw.map((r) =>
      Movement.restore(
        r.id,
        r.productId,
        r.warehouseId,
        r.userId,
        r.type,
        r.quantity,
        r.notes,
        r.createdAt,
      ),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
