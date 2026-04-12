import { InvalidSKUError } from '../errors/product.errors';

/**
 * SKU Value Object
 * Encapsula la validación del código SKU de un producto
 * Patrón: letras mayúsculas y números, mínimo 4 máximo 20 caracteres
 * Ejemplos: PROD001, SKU-A1, ABC123456
 */
export class SKU {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(sku: string): SKU {
    const trimmed = sku.trim().toUpperCase();

    if (trimmed.length < 4 || trimmed.length > 20) {
      throw new InvalidSKUError(
        'debe tener entre 4 y 20 caracteres (letras mayúsculas y números)',
      );
    }

    if (!/^[A-Z0-9-]*$/.test(trimmed)) {
      throw new InvalidSKUError(
        'solo puede contener letras mayúsculas, números y guiones',
      );
    }

    return new SKU(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
