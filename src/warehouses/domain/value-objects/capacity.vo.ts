/**
 * Capacity Value Object
 * Encapsula la lógica de validación de capacidad de una bodega
 */
export class Capacity {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(capacity: number): Capacity {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive integer');
    }
    if (capacity > 1000000) {
      throw new Error('Capacity cannot exceed 1,000,000 units');
    }
    return new Capacity(capacity);
  }

  getValue(): number {
    return this.value;
  }

  isValid(): boolean {
    return this.value > 0;
  }

  exceedsCapacity(used: number): boolean {
    return used > this.value;
  }

  getRemainingCapacity(used: number): number {
    return this.value - used;
  }

  equals(other: Capacity): boolean {
    return this.value === other.value;
  }
}
