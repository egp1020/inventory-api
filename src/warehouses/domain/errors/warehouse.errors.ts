import { DomainError } from '@shared/domain/errors/domain.errors';

export class WarehouseNotFoundError extends DomainError {
  constructor(warehouseId: string) {
    super('NOT_FOUND', `Warehouse with ID ${warehouseId} not found`);
    this.name = 'WarehouseNotFoundError';
  }
}

export class WarehouseAlreadyDeletedError extends DomainError {
  constructor(warehouseId: string) {
    super('CONFLICT', `Warehouse with ID ${warehouseId} has been deleted`);
    this.name = 'WarehouseAlreadyDeletedError';
  }
}

export class InvalidWarehouseNameError extends DomainError {
  constructor() {
    super(
      'UNPROCESSABLE',
      'Warehouse name must be between 1 and 100 characters',
    );
    this.name = 'InvalidWarehouseNameError';
  }
}

export class InvalidWarehouseLocationError extends DomainError {
  constructor() {
    super(
      'UNPROCESSABLE',
      'Warehouse location must be between 1 and 200 characters',
    );
    this.name = 'InvalidWarehouseLocationError';
  }
}
