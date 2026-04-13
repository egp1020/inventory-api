import { Warehouse } from '../entities';

/**
 * Port (Interface) - Warehouse Repository
 * Define el contrato que la aplicación espera para persistencia
 * La implementación concreta va en infrastructure/
 */
export interface IWarehouseRepository {
  save(warehouse: Warehouse): Promise<void>;
  findById(id: string): Promise<Warehouse | null>;
  findAll(): Promise<Warehouse[]>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    data: Warehouse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  delete(id: string): Promise<void>;
}
