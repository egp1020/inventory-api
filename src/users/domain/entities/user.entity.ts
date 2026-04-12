import { Role } from '@prisma/client';
import { Email } from '../../../auth/domain/value-objects/email.vo';
import { InvalidRoleForWarehouseError } from '../errors/user.errors';

/**
 * Entidad User en la capa de dominio para Users.
 * Contiene lógica de negocio sobre usuarios (roles, asignación de bodegas).
 * Reutiliza Email VO de auth.
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
   * Valida que si se intenta asignar bodega, el usuario sea OPERATOR.
   */
  validateWarehouseAssignment(warehouseId: string | null): void {
    if (warehouseId !== null && !this.isOperator()) {
      throw new InvalidRoleForWarehouseError();
    }
  }

  /**
   * Factory method para crear un nuevo usuario.
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

  /**
   * Crea una copia actualizada del usuario.
   */
  with(updates: {
    email?: string;
    role?: Role;
    warehouseId?: string | null;
  }): User {
    return new User(
      this.id,
      updates.email ? new Email(updates.email) : this.email,
      this.passwordHash,
      updates.role ?? this.role,
      updates.warehouseId !== undefined
        ? updates.warehouseId
        : this.warehouseId,
      this.createdAt,
      this.deletedAt,
    );
  }
}
