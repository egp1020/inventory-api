export type DomainErrorCode =
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'UNPROCESSABLE';

/**
 * Base para todos los errores de dominio.
 */
export abstract class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 401 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = 'No autorizado') {
    super('UNAUTHORIZED', message);
  }
}

/** 403 */
export class ForbiddenError extends DomainError {
  constructor(message: string = 'Acceso denegado') {
    super('FORBIDDEN', message);
  }
}

/** 404 */
export class NotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    const msg = id ? `${entity} con id '${id}' no encontrado` : `${entity} no encontrado`;
    super('NOT_FOUND', msg);
  }
}

/** 409 */
export class ConflictError extends DomainError {
  constructor(message: string = 'Conflicto de estado en el recurso') {
    super('CONFLICT', message);
  }
}

/** Business rules */
/** 422 */
export class UnprocessableError extends DomainError {
  constructor(message: string) {
    super('UNPROCESSABLE', message);
  }
}
