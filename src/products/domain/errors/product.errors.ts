import { DomainError } from '@shared/domain/errors/domain.errors';

export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super('NOT_FOUND', `Product with ID ${productId} not found`);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductBySKUNotFoundError extends DomainError {
  constructor(sku: string) {
    super('NOT_FOUND', `Product with SKU ${sku} not found`);
    this.name = 'ProductBySKUNotFoundError';
  }
}

export class SKUAlreadyExistsError extends DomainError {
  constructor(sku: string) {
    super('CONFLICT', `SKU ${sku} already exists in the system`);
    this.name = 'SKUAlreadyExistsError';
  }
}

export class InvalidSKUError extends DomainError {
  constructor(message: string) {
    super('UNPROCESSABLE', `Invalid SKU: ${message}`);
    this.name = 'InvalidSKUError';
  }
}

export class ProductHasMovementsError extends DomainError {
  constructor(productId: string) {
    super(
      'UNPROCESSABLE',
      `Cannot delete product ${productId} because it has associated movements`,
    );
    this.name = 'ProductHasMovementsError';
  }
}
