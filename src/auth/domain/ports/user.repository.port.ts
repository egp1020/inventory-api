import { User } from '../entities/user.entity';

/**
 * Port (interfaz) de repositorio de usuarios.
 * Contrato que la infraestructura debe implementar.
 * El dominio no conoce detalles de implementación (Prisma, SQL, etc).
 */
export interface IUserRepository {
  /**
   * Busca un usuario por email.
   * Retorna null si no existe.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario por ID.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario.
   */
  create(user: User): Promise<User>;

  /**
   * Actualiza un usuario existente.
   */
  update(user: User): Promise<User>;

  /**
   * Soft delete de usuario (marca deletedAt).
   */
  softDelete(id: string): Promise<void>;
}

