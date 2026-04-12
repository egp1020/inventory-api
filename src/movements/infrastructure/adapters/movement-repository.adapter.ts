import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { Movement } from '@movements/domain';
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
  private readonly logger = new Logger(MovementRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Guarda un movimiento con validaciones previas
   * Usa transacción para atomicidad
   */
  async save(
    movement: Movement,
    validateExistence: boolean = true,
  ): Promise<void> {
    this.logger.debug(
      `Validando movimiento: producto=${movement.getProductId()}, bodega=${movement.getWarehouseId()}, tipo=${movement.getTypeValue()}, cantidad=${movement.getQuantityValue()}`,
    );

    if (validateExistence) {
      // Validate that el producto existe
      const product = await this.prisma.product.findUnique({
        where: { id: movement.getProductId() },
      });
      if (!product) {
        this.logger.warn(
          `Producto no encontrado: id=${movement.getProductId()}`,
        );
        throw new ProductNotFoundForMovementError(movement.getProductId());
      }

      // Validate that la bodega existe
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: movement.getWarehouseId() },
      });
      if (!warehouse) {
        this.logger.warn(
          `Bodega no encontrada: id=${movement.getWarehouseId()}`,
        );
        throw new WarehouseNotFoundForMovementError(movement.getWarehouseId());
      }

      // Validate that el usuario existe
      const user = await this.prisma.user.findUnique({
        where: { id: movement.getUserId() },
      });
      if (!user) {
        this.logger.warn(`Usuario no encontrado: id=${movement.getUserId()}`);
        throw new UserNotFoundForMovementError(movement.getUserId());
      }

      // If is OPERATOR, validar que está asignado a esta bodega
      if (
        user.role === 'OPERATOR' &&
        user.warehouseId !== movement.getWarehouseId()
      ) {
        this.logger.warn(
          `OPERATOR no autorizado: usuario=${movement.getUserId()}, bodega=${movement.getWarehouseId()}`,
        );
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

        this.logger.debug(
          `Stock actual: producto=${movement.getProductId()}, bodega=${movement.getWarehouseId()}, stock=${currentStock}, requerido=${movement.getQuantityValue()}`,
        );

        if (currentStock < movement.getQuantityValue()) {
          this.logger.warn(
            `Stock insuficiente: producto=${movement.getProductId()}, bodega=${movement.getWarehouseId()}, disponible=${currentStock}, requerido=${movement.getQuantityValue()}`,
          );
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: movement.getTypeValue() as any, // Cast para hacer match con enum de Prisma
      quantity: movement.getQuantityValue(),
      notes: movement.getNotes(),
      createdAt: movement.getCreatedAt(),
    };

    // Usar transacción para asegurar atomicidad
    this.logger.debug(`Guardando movimiento en transacción: id=${data.id}`);
    await this.prisma.$transaction(async (prisma) => {
      await prisma.stockMovement.create({ data });
    });
    this.logger.log(
      `Movimiento guardado exitosamente: id=${data.id}, tipo=${movement.getTypeValue()}`,
    );
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (productId) {
      where.productId = productId;
    }
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    if (type) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
