import { User } from '../entities/user.entity';
import { Role } from '@prisma/client';

/**
 * Port (interfaz) para persistencia de usuarios.
 * Define los comportamientos que la infraestructura debe implementar.
 */
export interface IUserRepository {
  /**
   * Crea un nuevo usuario.
   */
  create(user: User): Promise<User>;

  /**
   * Obtiene un usuario por ID.
   * Retorna null si no existe.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Obtiene un usuario por email.
   * Retorna null si no existe.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Obtiene todos los usuarios (activos).
   * Soporta paginación.
   */
  findAll(page: number, limit: number): Promise<{ data: User[]; total: number }>;

  /**
   * Actualiza un usuario.
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Soft delete de un usuario.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Verifica si existe un usuario con email (excluyendo uno específico por ID).
   * Útil para validar unicidad al actualizar.
   */
  existsByEmailExcludingId(email: string, excludeId: string): Promise<boolean>;
}

/**
 * Port para validación de bodegas.
 * Usado en casos de uso para verificar que una bodega existe.
 */
export interface IWarehouseValidator {
  /**
   * Verifica si una bodega existe y está activa.
   */
  existsAndIsActive(id: string): Promise<boolean>;
}

