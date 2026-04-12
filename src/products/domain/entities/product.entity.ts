import { SKU } from '../value-objects';

/**
 * Product Entity
 * Representa un producto en el sistema de inventario
 * Encapsula el estado y comportamiento de un producto
 */
export class Product {
  private id: string;
  private sku: SKU;
  private name: string;
  private description: string | null;
  private unit: string;
  private minStockAlert: number;
  private createdAt: Date;
  private deletedAt: Date | null;

  private constructor(
    id: string,
    sku: SKU,
    name: string,
    description: string | null,
    unit: string,
    minStockAlert: number,
    createdAt: Date,
    deletedAt: Date | null = null,
  ) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.unit = unit;
    this.minStockAlert = minStockAlert;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  static create(
    id: string,
    sku: SKU,
    name: string,
    description: string | null,
    unit: string,
    minStockAlert: number,
  ): Product {
    return new Product(
      id,
      sku,
      name,
      description,
      unit,
      minStockAlert,
      new Date(),
    );
  }

  static restore(
    id: string,
    sku: string,
    name: string,
    description: string | null,
    unit: string,
    minStockAlert: number,
    createdAt: Date,
    deletedAt: Date | null,
  ): Product {
    return new Product(
      id,
      SKU.create(sku),
      name,
      description,
      unit,
      minStockAlert,
      createdAt,
      deletedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getSKU(): SKU {
    return this.sku;
  }

  getSKUValue(): string {
    return this.sku.getValue();
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getDescription(): string | null {
    return this.description;
  }

  setDescription(description: string | null): void {
    this.description = description;
  }

  getUnit(): string {
    return this.unit;
  }

  setUnit(unit: string): void {
    this.unit = unit;
  }

  getMinStockAlert(): number {
    return this.minStockAlert;
  }

  setMinStockAlert(minStockAlert: number): void {
    this.minStockAlert = minStockAlert;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  softDelete(): void {
    this.deletedAt = new Date();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
