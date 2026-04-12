import { Capacity } from '../value-objects';

/**
 * Warehouse Entity
 * Representa una bodega en el sistema de inventario
 * Encapsula el estado y comportamiento de una bodega
 */
export class Warehouse {
  private id: string;
  private name: string;
  private location: string;
  private capacity: Capacity;
  private isActive: boolean;
  private createdAt: Date;
  private deletedAt: Date | null;

  private constructor(
    id: string,
    name: string,
    location: string,
    capacity: Capacity,
    isActive: boolean,
    createdAt: Date,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.capacity = capacity;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  static create(
    id: string,
    name: string,
    location: string,
    capacity: Capacity,
  ): Warehouse {
    return new Warehouse(id, name, location, capacity, true, new Date());
  }

  static restore(
    id: string,
    name: string,
    location: string,
    capacity: number,
    isActive: boolean,
    createdAt: Date,
    deletedAt: Date | null,
  ): Warehouse {
    return new Warehouse(
      id,
      name,
      location,
      Capacity.create(capacity),
      isActive,
      createdAt,
      deletedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getLocation(): string {
    return this.location;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  getCapacity(): Capacity {
    return this.capacity;
  }

  setCapacity(capacity: Capacity): void {
    this.capacity = capacity;
  }

  getCapacityValue(): number {
    return this.capacity.getValue();
  }

  isActiveWarehouse(): boolean {
    return this.isActive && !this.deletedAt;
  }

  activate(): void {
    if (this.deletedAt) {
      throw new Error('Cannot activate a deleted warehouse');
    }
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  softDelete(): void {
    this.deletedAt = new Date();
    this.isActive = false;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }
}
