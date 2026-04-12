import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { Warehouse } from '@warehouses/domain';
import { IWarehouseRepository } from '@warehouses/domain/ports';

/**
 * WarehouseRepositoryAdapter
 * Implementa IWarehouseRepository usando Prisma
 * Adapta la persistencia a la interfaz definida en domain
 */
@Injectable()
export class WarehouseRepositoryAdapter implements IWarehouseRepository {
  private readonly logger = new Logger(WarehouseRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(warehouse: Warehouse): Promise<void> {
    const data = {
      id: warehouse.getId(),
      name: warehouse.getName(),
      location: warehouse.getLocation(),
      capacity: warehouse.getCapacityValue(),
      isActive: warehouse.isActiveWarehouse(),
      deletedAt: warehouse.getDeletedAt(),
    };

    const existing = await this.prisma.warehouse.findUnique({
      where: { id: warehouse.getId() },
    });

    if (existing) {
      this.logger.debug(
        `Updating bodega: id=${warehouse.getId()}, nombre=${warehouse.getName()}`,
      );
      await this.prisma.warehouse.update({
        where: { id: warehouse.getId() },
        data,
      });
      this.logger.log(
        `Bodega actualizada: id=${warehouse.getId()}, nombre=${warehouse.getName()}`,
      );
    } else {
      this.logger.debug(
        `Creating bodega: nombre=${warehouse.getName()}, ubicación=${warehouse.getLocation()}`,
      );
      await this.prisma.warehouse.create({ data });
      this.logger.log(
        `Bodega creada: id=${warehouse.getId()}, nombre=${warehouse.getName()}`,
      );
    }
  }

  async findById(id: string): Promise<Warehouse | null> {
    const raw = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!raw) {
      return null;
    }

    return Warehouse.restore(
      raw.id,
      raw.name,
      raw.location,
      raw.capacity,
      raw.isActive,
      raw.createdAt,
      raw.deletedAt,
    );
  }

  async findAll(): Promise<Warehouse[]> {
    const raw = await this.prisma.warehouse.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map((r) =>
      Warehouse.restore(
        r.id,
        r.name,
        r.location,
        r.capacity,
        r.isActive,
        r.createdAt,
        r.deletedAt,
      ),
    );
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: Warehouse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [raw, total] = await Promise.all([
      this.prisma.warehouse.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.warehouse.count({
        where: { deletedAt: null },
      }),
    ]);

    const data = raw.map((r) =>
      Warehouse.restore(
        r.id,
        r.name,
        r.location,
        r.capacity,
        r.isActive,
        r.createdAt,
        r.deletedAt,
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

  async delete(id: string): Promise<void> {
    const warehouse = await this.findById(id);
    if (warehouse) {
      this.logger.debug(`Deleting bodega (soft delete): id=${id}`);
      warehouse.softDelete();
      await this.save(warehouse);
      this.logger.log(`Bodega eliminada (soft delete): id=${id}`);
    }
  }
}
