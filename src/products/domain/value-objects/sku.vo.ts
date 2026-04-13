import { InvalidSKUError } from '../errors/product.errors';

/**
 * SKU Value Object
 * Encapsulates SKU code validation for a product
 * Pattern: uppercase letters and numbers, minimum 4 maximum 20 characters
 * Examples: PROD001, SKU-A1, ABC123456
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
        'must have between 4 and 20 characters (uppercase letters and numbers)',
      );
    }

    if (!/^[A-Z0-9-]*$/.test(trimmed)) {
      throw new InvalidSKUError(
        'can only contain uppercase letters, numbers and hyphens',
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
