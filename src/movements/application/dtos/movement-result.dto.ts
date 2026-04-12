/**
 * MovementResultDto
 * DTO resultado de operaciones con movimientos
 */
export class MovementResultDto {
  id: string;
  productId: string;
  warehouseId: string;
  userId: string;
  type: string;
  quantity: number;
  notes: string | null;
  createdAt: Date;

  constructor(
    id: string,
    productId: string,
    warehouseId: string,
    userId: string,
    type: string,
    quantity: number,
    notes: string | null,
    createdAt: Date,
  ) {
    this.id = id;
    this.productId = productId;
    this.warehouseId = warehouseId;
    this.userId = userId;
    this.type = type;
    this.quantity = quantity;
    this.notes = notes;
    this.createdAt = createdAt;
  }
}
