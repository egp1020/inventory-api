import { Inject, Injectable } from '@nestjs/common';
import {
  Capacity,
  IWarehouseRepository,
  WarehouseNotFoundError,
} from '@warehouses/domain';
import {
  UpdateWarehouseCommandDto,
  WarehouseResultDto,
} from '@warehouses/application/dtos';

const WAREHOUSE_REPOSITORY = Symbol('WAREHOUSE_REPOSITORY');

/**
 * UpdateWarehouseUseCase
 * Depende de (ports): IWarehouseRepository
 */
@Injectable()
export class UpdateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(
    id: string,
    command: UpdateWarehouseCommandDto,
  ): Promise<WarehouseResultDto> {
    const warehouse = await this.warehouseRepository.findById(id);

    if (!warehouse) {
      throw new WarehouseNotFoundError(id);
    }

    if (command.name) {
      warehouse.setName(command.name);
    }

    if (command.location) {
      warehouse.setLocation(command.location);
    }

    if (command.capacity !== undefined) {
      const newCapacity = Capacity.create(command.capacity);
      warehouse.setCapacity(newCapacity);
    }

    await this.warehouseRepository.save(warehouse);

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

export { WAREHOUSE_REPOSITORY };
