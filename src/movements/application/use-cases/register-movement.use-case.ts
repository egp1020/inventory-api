import { Inject, Injectable } from '@nestjs/common';
import type { IMovementRepository } from '@movements/domain/ports';
import { Movement, MovementType } from '@movements/domain';
import { Quantity } from '@movements/domain/value-objects';
import {
  RegisterMovementCommandDto,
  MovementResultDto,
} from '@movements/application/dtos';

const MOVEMENT_REPOSITORY = Symbol('MOVEMENT_REPOSITORY');

/**
 * RegisterMovementUseCase
 * Registra un nuevo movimiento (entrada o salida)
 * Valida stock disponible para SALIDAs mediante el repositorio
 * Depende de: IMovementRepository (que hace todas las validaciones)
 */
@Injectable()
export class RegisterMovementUseCase {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMovementRepository,
  ) {}

  async execute(
    command: RegisterMovementCommandDto,
  ): Promise<MovementResultDto> {
    // Crear el movimiento
    const quantity = Quantity.create(command.quantity);
    const movement = Movement.create(
      command.productId,
      command.warehouseId,
      command.userId,
      command.type,
      quantity,
      command.notes,
    );

    movement.validate();
    // El repositorio hará las validaciones (existencia de producto, bodega, usuario, stock, etc.)
    await this.movementRepository.save(movement);

    return new MovementResultDto(
      movement.getId(),
      movement.getProductId(),
      movement.getWarehouseId(),
      movement.getUserId(),
      movement.getTypeValue(),
      movement.getQuantityValue(),
      movement.getNotes(),
      movement.getCreatedAt(),
    );
  }
}
