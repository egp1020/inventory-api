import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Warehouse, Capacity } from '@warehouses/domain';
import type { IWarehouseRepository } from '@warehouses/domain';
import {
  CreateWarehouseCommandDto,
  WarehouseResultDto,
} from '@warehouses/application/dtos';
import { WAREHOUSE_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';

/**
 * CreateWarehouseUseCase
 * Depende de (ports): IWarehouseRepository
 */
@Injectable()
export class CreateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(
    command: CreateWarehouseCommandDto,
  ): Promise<WarehouseResultDto> {
    const capacity = Capacity.create(command.capacity);
    const warehouse = Warehouse.create(
      randomUUID(),
      command.name,
      command.location,
      capacity,
    );

    await this.warehouseRepository.save(warehouse);

    return this.mapToResultDto(warehouse);
  }

  private mapToResultDto(warehouse: Warehouse): WarehouseResultDto {
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
