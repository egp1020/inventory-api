/**
 * RegisterMovementCommandDto
 * DTO para comando de registro de movimiento
 */
export class RegisterMovementCommandDto {
  productId: string;
  warehouseId: string;
  userId: string;
  type: string;
  quantity: number;
  notes?: string;

  constructor(
    productId: string,
    warehouseId: string,
    userId: string,
    type: string,
    quantity: number,
    notes?: string,
  ) {
    this.productId = productId;
    this.warehouseId = warehouseId;
    this.userId = userId;
    this.type = type;
    this.quantity = quantity;
    this.notes = notes;
  }
}
