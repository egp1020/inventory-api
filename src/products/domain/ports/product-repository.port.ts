import { Product } from '../entities';

/**
 * Port (Interface) - Product Repository
 * Define el contrato que la aplicación espera para persistencia
 * La implementación concreta va en infrastructure/
 */
export interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findBySKU(sku: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findAllPaginated(page: number, limit: number): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  delete(id: string): Promise<void>;
}
