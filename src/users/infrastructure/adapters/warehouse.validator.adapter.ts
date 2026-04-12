import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import type { IWarehouseValidator } from '../../domain/ports/user.repository.port';

@Injectable()
export class WarehouseValidatorAdapter implements IWarehouseValidator {
  constructor(private readonly prisma: PrismaService) {}

  async existsAndIsActive(id: string): Promise<boolean> {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });
    return warehouse !== null && warehouse.isActive && warehouse.deletedAt === null;
  }
}
