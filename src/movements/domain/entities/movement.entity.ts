import { randomUUID } from 'crypto';
import { Quantity } from '@movements/domain/value-objects';
import { InvalidMovementTypeError } from '@movements/domain/errors';

/**
 * MovementType Enum
 * ENTRADA: Ingreso de mercancía
 * SALIDA: Egreso de mercancía
 */
export enum MovementType {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

/**
 * Movement Entity
 * Representa un movimiento de inventario (entrada o salida de productos)
 * Encapsula validaciones y lógica de negocio
 */
export class Movement {
  private constructor(
    private readonly id: string,
    private readonly productId: string,
    private readonly warehouseId: string,
    private readonly userId: string,
    private readonly type: MovementType,
    private readonly quantity: Quantity,
    private readonly notes: string | null,
    private readonly createdAt: Date,
  ) {}

  /**
   * Crea un nuevo movimiento
   * Valida que el tipo sea válido
   */
  static create(
    productId: string,
    warehouseId: string,
    userId: string,
    type: MovementType,
    quantity: Quantity,
    notes?: string,
  ): Movement {
    if (!Object.values(MovementType).includes(type)) {
      throw new InvalidMovementTypeError(type);
    }

    return new Movement(
      randomUUID(),
      productId,
      warehouseId,
      userId,
      type,
      quantity,
      notes || null,
      new Date(),
    );
  }

  /**
   * Restaura un movimiento desde datos persistidos (hidratación)
   */
  static restore(
    id: string,
    productId: string,
    warehouseId: string,
    userId: string,
    type: string,
    quantity: number,
    notes: string | null,
    createdAt: Date,
  ): Movement {
    const movementType = Object.values(MovementType).find(
      (t) => t === (type as unknown as MovementType),
    );
    if (!movementType) {
      throw new InvalidMovementTypeError(type);
    }

    return new Movement(
      id,
      productId,
      warehouseId,
      userId,
      movementType,
      Quantity.create(quantity),
      notes,
      createdAt,
    );
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getProductId(): string {
    return this.productId;
  }

  getWarehouseId(): string {
    return this.warehouseId;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): MovementType {
    return this.type;
  }

  getTypeValue(): string {
    return this.type;
  }

  getQuantity(): Quantity {
    return this.quantity;
  }

  getQuantityValue(): number {
    return this.quantity.getValue();
  }

  getNotes(): string | null {
    return this.notes;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Valida que el movimiento sea válido para registrarse
   * Se ejecuta antes de persistir
   */
  validate(): void {
    // Movement type already validated in constructor
    // Quantity already validated in VO
    // This method can be extended with additional domain rules
  }

  /**
   * Retorna true si es una ENTRADA (ingreso)
   */
  isEntry(): boolean {
    return this.type === MovementType.ENTRADA;
  }

  /**
   * Retorna true si es una SALIDA (egreso)
   */
  isExit(): boolean {
    return this.type === MovementType.SALIDA;
  }
}
