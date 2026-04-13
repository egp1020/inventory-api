/**
 * Result: Contrato de salida desde use cases de lectura/escritura de Warehouse
 */
export class WarehouseResultDto {
  id: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(
    id: string,
    name: string,
    location: string,
    capacity: number,
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
}
