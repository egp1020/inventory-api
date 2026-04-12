import { Movement } from '@movements/domain/entities';

/**
 * IMovementRepository - Port (Interfaz) de Persistencia de Movimientos
 *
 * Define el contrato que la infraestructura DEBE implementar para persistir
 * movimientos de stock. Pertenece a la capa Domain y NO tiene dependencias de frameworks.
 *
 * Responsabilidades de la implementación:
 * 1. Persistir movimientos dentro de transacciones atómicas (prisma.$transaction)
 * 2. Validar existencia de producto, bodega, usuario
 * 3. Validar permisos (OPERATOR solo puede crear en su bodega asignada)
 * 4. Validar stock disponible antes de permitir SALIDA
 * 5. Calcular stock dinámicamente (no almacenado, derivado del historial)
 *
 * Implementado en: src/movements/infrastructure/adapters/movement-repository.adapter.ts
 */
export interface IMovementRepository {
  /**
   * Guarda un nuevo movimiento en la base de datos.
   *
   * Nota crítica: Esta operación DEBE ejecutarse dentro de una transacción
   * Prisma (prisma.$transaction) para garantizar atomicidad cuando hay
   * validaciones y persistencia concurrentes.
   *
   * Validaciones que realiza:
   * - Producto existe
   * - Bodega existe
   * - Usuario existe
   * - Si es OPERATOR: que tenga acceso a esa bodega
   * - Si es SALIDA: stock suficiente disponible
   *
   * @param movement - Entidad Movement ya validada en dominio
   * @throws {ProductNotFoundForMovementError}
   * @throws {WarehouseNotFoundForMovementError}
   * @throws {UserNotFoundForMovementError}
   * @throws {UnauthorizedMovementError}
   * @throws {InsufficientStockError}
   */
  save(movement: Movement): Promise<void>;

  /**
   * Obtiene un movimiento por ID
   */
  findById(id: string): Promise<Movement | null>;

  /**
   * Calcula el stock actual de un producto en una bodega específica.
   *
   * El stock NO se almacena como campo separado. Se calcula dinámicamente como:
   * stock = SUM(ENTRADA) - SUM(SALIDA) para ese producto en esa bodega
   *
   * Esta estrategia:
   * ✅ Elimina redundancia de datos
   * ✅ Garantiza consistencia (no hay desincronización)
   * ✅ Permite auditoría completa (historial intacto)
   * ❌ Requiere índices en queries de stock (ver prisma schema)
   *
   * @param productId - UUID del producto
   * @param warehouseId - UUID de la bodega
   * @returns Promise<number> - Stock actual (puede ser negativo si hay inconsistencias)
   */
  getStockByProductAndWarehouse(
    productId: string,
    warehouseId: string,
  ): Promise<number>;

  /**
   * Lista movimientos con filtros y paginación.
   *
   * Filtros opcionales:
   * - productId: movimientos de un producto específico
   * - warehouseId: movimientos de una bodega específica
   * - type: filtrar por ENTRADA o SALIDA
   * - startDate/endDate: rango temporal (inclusive)
   *
   * Paginación:
   * - page: 1-based (page 1 = registros 1-limit)
   * - limit: cantidad de registros por página
   *
   * @param productId - [OPTIONAL] UUID del producto
   * @param warehouseId - [OPTIONAL] UUID de la bodega
   * @param type - [OPTIONAL] "ENTRADA" | "SALIDA"
   * @param startDate - [OPTIONAL] Fecha inicial (UTC)
   * @param endDate - [OPTIONAL] Fecha final (UTC)
   * @param page - Número de página (default: 1)
   * @param limit - Registros por página (default: 10)
   * @returns Movimientos paginados con total y cálculo de totalPages
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
