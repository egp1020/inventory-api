import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IMovementRepository } from '@movements/domain/ports';
import { Movement } from '@movements/domain';
import { Quantity } from '@movements/domain/value-objects';
import {
  RegisterMovementCommandDto,
  MovementResultDto,
} from '@movements/application/dtos';

const MOVEMENT_REPOSITORY = Symbol('MOVEMENT_REPOSITORY');

/**
 * RegisterMovementUseCase
 *
 * Registra un nuevo movimiento (entrada o salida) en el inventario.
 * Responsabilidad: Orquestar la creación y validación de movimientos dentro de una transacción atómica.
 *
 * Flujo:
 * 1. Crear entidad Movement con los datos del comando
 * 2. Ejecutar validaciones de dominio (tipo válido, cantidad > 0)
 * 3. Delegar al repositorio para:
 *    - Validar producto existe
 *    - Validar bodega existe
 *    - Validar usuario tiene permisos en esa bodega (si es OPERATOR)
 *    - Validar stock disponible (si es SALIDA)
 *    - Persistir en transacción
 * 4. Retornar DTO con datos del movimiento created
 *
 * Nota: Toda operación de persistencia se ejecuta en transacción Prisma $transaction
 * para garantizar atomicidad.
 *
 * @throws {ProductNotFoundForMovementError} Si el producto no existe
 * @throws {WarehouseNotFoundForMovementError} Si la bodega no existe
 * @throws {UserNotFoundForMovementError} Si el usuario no existe
 * @throws {UnauthorizedMovementError} Si OPERATOR intenta crear en otra bodega
 * @throws {InsufficientStockError} Si intenta SALIDA sin stock suficiente
 */
@Injectable()
export class RegisterMovementUseCase {
  private readonly logger = new Logger(RegisterMovementUseCase.name);

  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMovementRepository,
  ) {}

  /**
   * Executes the movement registration use case.
   *
   * @param command - Command with data for product, warehouse, user, type and quantity
   * @returns Promise<MovementResultDto> - Created movement with all its details
   * @throws Domain errors if validations fail (see class)
   */
  async execute(
    command: RegisterMovementCommandDto,
  ): Promise<MovementResultDto> {
    this.logger.debug(
      `Registering movement: product=${command.productId}, warehouse=${command.warehouseId}, type=${command.type}, quantity=${command.quantity}`,
    );

    try {
      // Create the movement
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
      // The repository will perform validations (product existence, warehouse, user, stock, etc.)
      await this.movementRepository.save(movement);

      this.logger.log(
        `Movement registered successfully: id=${movement.getId()}, type=${movement.getTypeValue()}`,
      );

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
    } catch (error) {
      this.logger.error(
        `Error registering movement: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : '',
      );
      throw error;
    }
  }
}
