/**
 * Result: Contrato de salida desde use cases de lectura/escritura de Product
 */
export class ProductResultDto {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  unit: string;
  minStockAlert: number;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(
    id: string,
    sku: string,
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
}
