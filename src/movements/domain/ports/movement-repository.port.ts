import { Movement } from '@movements/domain/entities';

/**
 * IMovementRepository - Port (Interface) for Movement Persistence
 *
 * Defines the contract that infrastructure MUST implement to persist
 * stock movements. Belongs to the Domain layer and has NO framework dependencies.
 *
 * Implementation responsibilities:
 * 1. Persist movements within atomic transactions (prisma.$transaction)
 * 2. Validate product exists
 * 3. Validate warehouse exists
 * 4. Validate permissions (OPERATOR can only create in assigned warehouse)
 * 5. Validate available stock before allowing SALIDA (output)
 * 6. Calculate stock dynamically (not stored, derived from history)
 *
 * Implemented in: src/movements/infrastructure/adapters/movement-repository.adapter.ts
 */
export interface IMovementRepository {
  /**
   * Saves a new movement in the database.
   *
   * Critical note: This operation MUST execute within a Prisma transaction
   * (prisma.$transaction) to guarantee atomicity when there are
   * validations and concurrent persistence.
   *
   * Validations performed:
   * - Product exists
   * - Warehouse exists
   * - User exists
   * - If OPERATOR: has access to that warehouse
   * - If SALIDA: sufficient available stock
   *
   * @param movement - Movement entity already validated in domain
   * @throws {ProductNotFoundForMovementError}
   * @throws {WarehouseNotFoundForMovementError}
   * @throws {UserNotFoundForMovementError}
   * @throws {UnauthorizedMovementError}
   * @throws {InsufficientStockError}
   */
  save(movement: Movement): Promise<void>;

  /**
   * Gets a movement by ID
   */
  findById(id: string): Promise<Movement | null>;

  /**
   * Calculates the current stock of a product in a specific warehouse.
   *
   * Stock is NOT stored as a separate field. It is calculated dynamically as:
   * stock = SUM(ENTRADA) - SUM(SALIDA) for that product in that warehouse
   *
   * This strategy:
   * ✅ Eliminates data redundancy
   * ✅ Guarantees consistency (no desynchronization)
   * ✅ Allows complete audit (history intact)
   * ❌ Requires indexes on stock queries (see prisma schema)
   *
   * @param productId - Product UUID
   * @param warehouseId - Warehouse UUID
   * @returns Promise<number> - Current stock (may be negative if inconsistencies exist)
   */
  getStockByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;

  /**
   * Lists movements with filters and pagination.
   *
   * Optional filters:
   * - productId: movements of a specific product
   * - warehouseId: movements of a specific warehouse
   * - type: filter by ENTRADA or SALIDA
   * - startDate/endDate: time range (inclusive)
   *
   * Pagination:
   * - page: 1-based (page 1 = records 1-limit)
   * - limit: quantity of records per page
   *
   * @param productId - [OPTIONAL] Product UUID
   * @param warehouseId - [OPTIONAL] Warehouse UUID
   * @param type - [OPTIONAL] "ENTRADA" | "SALIDA"
   * @param startDate - [OPTIONAL] Start date (UTC)
   * @param endDate - [OPTIONAL] End date (UTC)
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 10)
   * @returns Paginated movements with total and totalPages calculation
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
