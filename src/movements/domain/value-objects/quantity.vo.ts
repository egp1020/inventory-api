/**
 * Quantity Value Object
 * Representa una cantidad de movimiento
 */
export class Quantity {
  private constructor(private readonly value: number) {
    if (value <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  getValue(): number {
    return this.value;
  }
}
