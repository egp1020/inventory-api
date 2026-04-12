import { DomainError } from '@shared/domain/errors/domain.errors';

export class ProductNotFoundError extends DomainError {
  constructor(productId: string) {
    super('NOT_FOUND', `Producto con ID ${productId} no encontrado`);
    this.name = 'ProductNotFoundError';
  }
}

export class ProductBySKUNotFoundError extends DomainError {
  constructor(sku: string) {
    super('NOT_FOUND', `Producto con SKU ${sku} no encontrado`);
    this.name = 'ProductBySKUNotFoundError';
  }
}

export class SKUAlreadyExistsError extends DomainError {
  constructor(sku: string) {
    super('CONFLICT', `SKU ${sku} ya existe en el sistema`);
    this.name = 'SKUAlreadyExistsError';
  }
}

export class InvalidSKUError extends DomainError {
  constructor(message: string) {
    super('UNPROCESSABLE', `SKU inválido: ${message}`);
    this.name = 'InvalidSKUError';
  }
}

export class ProductHasMovementsError extends DomainError {
  constructor(productId: string) {
    super(
      'UNPROCESSABLE',
      `No se puede eliminar el producto ${productId} porque tiene movimientos asociados`,
    );
    this.name = 'ProductHasMovementsError';
  }
}
