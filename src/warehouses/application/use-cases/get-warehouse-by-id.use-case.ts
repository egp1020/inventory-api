import { Inject, Injectable } from '@nestjs/common';
import { WarehouseNotFoundError } from '@warehouses/domain';
import type { IWarehouseRepository } from '@warehouses/domain';
import { WarehouseResultDto } from '@warehouses/application/dtos';
import { WAREHOUSE_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';

/**
 * GetWarehouseByIdUseCase
 * Depende de (ports): IWarehouseRepository
 */
@Injectable()
export class GetWarehouseByIdUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(id: string): Promise<WarehouseResultDto> {
    const warehouse = await this.warehouseRepository.findById(id);

    if (!warehouse) {
      throw new WarehouseNotFoundError(id);
    }

    return this.mapToResultDto(warehouse);
  }

  private mapToResultDto(warehouse: any): WarehouseResultDto {
    return new WarehouseResultDto(
      warehouse.getId(),
      warehouse.getName(),
      warehouse.getLocation(),
      warehouse.getCapacityValue(),
      warehouse.isActiveWarehouse(),
      warehouse.getCreatedAt(),
      warehouse.getDeletedAt(),
    );
  }
}

export { WAREHOUSE_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
