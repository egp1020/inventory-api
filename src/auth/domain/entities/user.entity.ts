import { Role } from '@prisma/client';
import { Email } from '../value-objects/email.vo';

/**
 * Entidad User en la capa de dominio.
 * Representa un usuario del sistema con su rol y bodega asignada.
 * Las contraseñas se manejan como hashes en la infraestructura.
 */
export class User {
  constructor(
    readonly id: string,
    readonly email: Email,
    readonly passwordHash: string,
    readonly role: Role,
    readonly warehouseId: string | null,
    readonly createdAt: Date,
    readonly deletedAt: Date | null = null,
  ) {}

  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isOperator(): boolean {
    return this.role === 'OPERATOR';
  }

  isActive(): boolean {
    return this.deletedAt === null;
  }

  hasWarehouse(): boolean {
    return this.warehouseId !== null;
  }

  /**
   * Factory method para crear un nuevo usuario desde raw data.
   */
  static create(data: {
    id: string;
    email: string;
    passwordHash: string;
    role: Role;
    warehouseId: string | null;
    createdAt: Date;
    deletedAt?: Date | null;
  }): User {
    return new User(
      data.id,
      new Email(data.email),
      data.passwordHash,
      data.role,
      data.warehouseId,
      data.createdAt,
      data.deletedAt ?? null,
    );
  }
}
