import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { Product } from '@products/domain';
import { IProductRepository } from '@products/domain/ports';

/**
 * ProductRepositoryAdapter
 * Implementa IProductRepository usando Prisma
 * Adapta la persistencia a la interfaz definida en domain
 */
@Injectable()
export class ProductRepositoryAdapter implements IProductRepository {
  private readonly logger = new Logger(ProductRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(product: Product): Promise<void> {
    const data = {
      id: product.getId(),
      sku: product.getSKUValue(),
      name: product.getName(),
      description: product.getDescription(),
      unit: product.getUnit(),
      minStockAlert: product.getMinStockAlert(),
      deletedAt: product.getDeletedAt(),
    };

    const existing = await this.prisma.product.findUnique({
      where: { id: product.getId() },
    });

    if (existing) {
      this.logger.debug(
        `Actualizando producto: id=${product.getId()}, sku=${product.getSKUValue()}`,
      );
      await this.prisma.product.update({
        where: { id: product.getId() },
        data,
      });
      this.logger.log(
        `Producto actualizado: id=${product.getId()}, sku=${product.getSKUValue()}`,
      );
    } else {
      this.logger.debug(
        `Creando producto: sku=${product.getSKUValue()}, nombre=${product.getName()}`,
      );
      await this.prisma.product.create({ data });
      this.logger.log(
        `Producto creado: id=${product.getId()}, sku=${product.getSKUValue()}`,
      );
    }
  }

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!raw) {
      return null;
    }

    return Product.restore(
      raw.id,
      raw.sku,
      raw.name,
      raw.description,
      raw.unit,
      raw.minStockAlert,
      raw.createdAt,
      raw.deletedAt,
    );
  }

  async findBySKU(sku: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!raw) {
      return null;
    }

    return Product.restore(
      raw.id,
      raw.sku,
      raw.name,
      raw.description,
      raw.unit,
      raw.minStockAlert,
      raw.createdAt,
      raw.deletedAt,
    );
  }

  async findAll(): Promise<Product[]> {
    const raw = await this.prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return raw.map((r) =>
      Product.restore(
        r.id,
        r.sku,
        r.name,
        r.description,
        r.unit,
        r.minStockAlert,
        r.createdAt,
        r.deletedAt,
      ),
    );
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [raw, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: { deletedAt: null },
      }),
    ]);

    const data = raw.map((r) =>
      Product.restore(
        r.id,
        r.sku,
        r.name,
        r.description,
        r.unit,
        r.minStockAlert,
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
    const product = await this.findById(id);
    if (product) {
      this.logger.debug(`Eliminando producto: id=${id}`);
      product.softDelete();
      await this.save(product);
      this.logger.log(`Producto eliminado (soft delete): id=${id}`);
    }
  }

  async hasMovements(productId: string): Promise<boolean> {
    const count = await this.prisma.stockMovement.count({
      where: { productId },
    });
    return count > 0;
  }
}
