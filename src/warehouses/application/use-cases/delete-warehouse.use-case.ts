import { Inject, Injectable } from '@nestjs/common';
import {
  IWarehouseRepository,
  WarehouseNotFoundError,
} from '@warehouses/domain';

const WAREHOUSE_REPOSITORY = Symbol('WAREHOUSE_REPOSITORY');

/**
 * DeleteWarehouseUseCase
 * Realiza soft delete (marca como eliminada)
 * Depende de (ports): IWarehouseRepository
 */
@Injectable()
export class DeleteWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(id);

    if (!warehouse) {
      throw new WarehouseNotFoundError(id);
    }

    warehouse.softDelete();
    await this.warehouseRepository.save(warehouse);
  }
}

export { WAREHOUSE_REPOSITORY };
