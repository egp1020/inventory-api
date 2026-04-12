import { DomainError } from '@shared/domain/errors/domain.errors';

export class WarehouseNotFoundError extends DomainError {
  constructor(warehouseId: string) {
    super('NOT_FOUND', `Bodega con ID ${warehouseId} no encontrada`);
    this.name = 'WarehouseNotFoundError';
  }
}

export class WarehouseAlreadyDeletedError extends DomainError {
  constructor(warehouseId: string) {
    super('CONFLICT', `Bodega con ID ${warehouseId} ha sido eliminada`);
    this.name = 'WarehouseAlreadyDeletedError';
  }
}

export class InvalidWarehouseNameError extends DomainError {
  constructor() {
    super(
      'UNPROCESSABLE',
      'El nombre de la bodega debe estar entre 1 y 100 caracteres',
    );
    this.name = 'InvalidWarehouseNameError';
  }
}

export class InvalidWarehouseLocationError extends DomainError {
  constructor() {
    super(
      'UNPROCESSABLE',
      'La ubicación de la bodega debe estar entre 1 y 200 caracteres',
    );
    this.name = 'InvalidWarehouseLocationError';
  }
}
