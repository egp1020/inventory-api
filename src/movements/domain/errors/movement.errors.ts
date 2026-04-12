import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * MovementNotFoundError
 * Lanzado cuando se intenta obtener un movimiento que no existe
 */
export class MovementNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `Movimiento con ID "${id}" no encontrado`);
    this.name = 'MovementNotFoundError';
  }
}

/**
 * InsufficientStockError
 * Lanzado cuando hay intento de sacar más producto del que hay disponible
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
      `Stock insuficiente para producto "${productId}" en bodega "${warehouseId}". Disponible: ${available}, Solicitado: ${requested}`,
    );
    this.name = 'InsufficientStockError';
  }
}

/**
 * InvalidMovementTypeError
 * Lanzado cuando el tipo de movimiento es inválido
 */
export class InvalidMovementTypeError extends DomainError {
  constructor(type: string) {
    super(
      'UNPROCESSABLE',
      `Tipo de movimiento inválido "${type}". Permitidos: ENTRADA, SALIDA`,
    );
    this.name = 'InvalidMovementTypeError';
  }
}

/**
 * WarehouseNotFoundForMovementError
 * Lanzado cuando la bodega no existe
 */
export class WarehouseNotFoundForMovementError extends DomainError {
  constructor(warehouseId: string) {
    super('NOT_FOUND', `Bodega con ID "${warehouseId}" no encontrada`);
    this.name = 'WarehouseNotFoundForMovementError';
  }
}

/**
 * ProductNotFoundForMovementError
 * Lanzado cuando el producto no existe
 */
export class ProductNotFoundForMovementError extends DomainError {
  constructor(productId: string) {
    super('NOT_FOUND', `Producto con ID "${productId}" no encontrado`);
    this.name = 'ProductNotFoundForMovementError';
  }
}

/**
 * UserNotFoundForMovementError
 * Lanzado cuando el usuario no existe
 */
export class UserNotFoundForMovementError extends DomainError {
  constructor(userId: string) {
    super('NOT_FOUND', `Usuario con ID "${userId}" no encontrado`);
    this.name = 'UserNotFoundForMovementError';
  }
}

/**
 * UnauthorizedMovementError
 * Lanzado cuando el usuario intenta registrar movimiento en bodega no asignada
 */
export class UnauthorizedMovementError extends DomainError {
  constructor(userId: string, warehouseId: string) {
    super(
      'FORBIDDEN',
      `Usuario "${userId}" no autorizado para registrar movimientos en bodega "${warehouseId}"`,
    );
    this.name = 'UnauthorizedMovementError';
  }
}
