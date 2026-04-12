import { Movement } from '@movements/domain/entities';

/**
 * IMovementRepository
 * Puerto (interfaz) que define el contrato para persistencia de movimientos
 * Implementado en infrastructure
 */
export interface IMovementRepository {
  /**
   * Guarda un nuevo movimiento
   * Debe ejecutarse dentro de una transacción
   */
  save(movement: Movement): Promise<void>;

  /**
   * Obtiene un movimiento por ID
   */
  findById(id: string): Promise<Movement | null>;

  /**
   * Obtiene el stock actual de un producto en una bodega
   * Calcula dinámicamente sumando ENTRADAs y restando SALIDAs
   */
  getStockByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;

  /**
   * Lista movimientos con filtros opcionales
   */
  listMovements(
    productId?: string,
    warehouseId?: string,
    type?: string,
    startDate?: Date,
    endDate?: Date,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Movement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
