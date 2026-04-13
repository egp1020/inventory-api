import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * MovementNotFoundError
 * Thrown when attempting to get a movement that does not exist
 */
export class MovementNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `Movement with ID "${id}" not found`);
    this.name = 'MovementNotFoundError';
  }
}

/**
 * InsufficientStockError
 * Thrown when attempting to remove more product than is available
 */
export class InsufficientStockError extends DomainError {
  constructor(
    productId: string,
    warehouseId: string,
    available: number,
    requested: number,
  ) {
    super(
      'UNPROCESSABLE',
      `Insufficient stock for product "${productId}" in warehouse "${warehouseId}". Available: ${available}, Requested: ${requested}`,
    );
    this.name = 'InsufficientStockError';
  }
}

/**
 * InvalidMovementTypeError
 * Thrown when the movement type is invalid
 */
export class InvalidMovementTypeError extends DomainError {
  constructor(type: string) {
    super(
      'UNPROCESSABLE',
      `Invalid movement type "${type}". Allowed: ENTRADA, SALIDA`,
    );
    this.name = 'InvalidMovementTypeError';
  }
}

/**
 * WarehouseNotFoundForMovementError
 * Thrown when the warehouse does not exist
 */
export class WarehouseNotFoundForMovementError extends DomainError {
  constructor(warehouseId: string) {
    super('NOT_FOUND', `Warehouse with ID "${warehouseId}" not found`);
    this.name = 'WarehouseNotFoundForMovementError';
  }
}

/**
 * ProductNotFoundForMovementError
 * Thrown when the product does not exist
 */
export class ProductNotFoundForMovementError extends DomainError {
  constructor(productId: string) {
    super('NOT_FOUND', `Product with ID "${productId}" not found`);
    this.name = 'ProductNotFoundForMovementError';
  }
}

/**
 * UserNotFoundForMovementError
 * Thrown when the user does not exist
 */
export class UserNotFoundForMovementError extends DomainError {
  constructor(userId: string) {
    super('NOT_FOUND', `User with ID "${userId}" not found`);
    this.name = 'UserNotFoundForMovementError';
  }
}

/**
 * UnauthorizedMovementError
 * Thrown when the user attempts to register a movement in an unassigned warehouse
 */
export class UnauthorizedMovementError extends DomainError {
  constructor(userId: string, warehouseId: string) {
    super(
      'FORBIDDEN',
      `User "${userId}" unauthorized to register movements in warehouse "${warehouseId}"`,
    );
    this.name = 'UnauthorizedMovementError';
  }
}
