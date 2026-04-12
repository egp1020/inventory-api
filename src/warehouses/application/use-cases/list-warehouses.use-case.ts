import { Inject, Injectable } from '@nestjs/common';
import { IWarehouseRepository } from '@warehouses/domain';
import { PaginatedWarehouseResultDto, WarehouseResultDto } from '@warehouses/application/dtos';

const WAREHOUSE_REPOSITORY = Symbol('WAREHOUSE_REPOSITORY');

/**
 * ListWarehousesUseCase
 * Depende de (ports): IWarehouseRepository
 */
@Injectable()
export class ListWarehousesUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<PaginatedWarehouseResultDto> {
    const result = await this.warehouseRepository.findAllPaginated(
      page,
      limit,
    );

    const data = result.data.map((warehouse) =>
      this.mapToResultDto(warehouse),
    );

    return new PaginatedWarehouseResultDto(
      data,
      result.page,
      result.limit,
      result.total,
    );
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
