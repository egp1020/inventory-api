import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * Error cuando se intenta crear un usuario con un email que ya existe.
 */
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('CONFLICT', `El usuario con email '${email}' ya existe`);
  }
}

/**
 * Error cuando se intenta actualizar un usuario que no existe.
 */
export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `Usuario con id '${id}' no encontrado`);
  }
}

/**
 * Error cuando un OPERATOR intenta asignar una bodega que no existe.
 */
export class WarehouseNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `Bodega con id '${id}' no encontrada`);
  }
}

/**
 * Error cuando se intenta reasignar bodega a un usuario que no es OPERATOR.
 */
export class InvalidRoleForWarehouseError extends DomainError {
  constructor() {
    super('UNPROCESSABLE', 'Solo los usuarios con rol OPERATOR pueden tener una bodega asignada');
  }
}

/**
 * Error cuando un OPERATOR intenta acceder a recursos de otra bodega.
 */
export class ForbiddenOperatorError extends DomainError {
  constructor(message: string = 'No tienes acceso a esta bodega') {
    super('FORBIDDEN', message);
  }
}
