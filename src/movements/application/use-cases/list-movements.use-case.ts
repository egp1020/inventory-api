import { Inject, Injectable } from '@nestjs/common';
import type { IMovementRepository } from '@movements/domain/ports';
import {
  MovementResultDto,
  PaginatedMovementResultDto,
  MOVEMENT_REPOSITORY,
} from '@movements/application';


/**
 * ListMovementsUseCase
 * Lista movimientos con filtros opcionales
 * Depende de: IMovementRepository
 */
@Injectable()
export class ListMovementsUseCase {
  constructor(
  @Inject(MOVEMENT_REPOSITORY)
  private readonly movementRepository: IMovementRepository,
  ) {}

  async execute(
  productId?: string,
  warehouseId?: string,
  type?: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  limit: number = 10,
  ): Promise<PaginatedMovementResultDto> {
  const result = await this.movementRepository.listMovements(
  productId,
  warehouseId,
  type,
  startDate,
  endDate,
  page,
  limit,
  );

  const data = result.data.map(
  (m) =>
  new MovementResultDto(
  m.getId(),
  m.getProductId(),
  m.getWarehouseId(),
  m.getUserId(),
  m.getTypeValue(),
  m.getQuantityValue(),
  m.getNotes(),
  m.getCreatedAt(),
  ),
  );

  return new PaginatedMovementResultDto(
  data,
  result.total,
  result.page,
  result.limit,
  result.totalPages,
  );
  }
}
