export type DomainErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE';

/**
 * Base for all domain errors.
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
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message);
  }
}

/** 403 */
export class ForbiddenError extends DomainError {
  constructor(message: string = 'Access denied') {
    super('FORBIDDEN', message);
  }
}

/** 404 */
export class NotFoundError extends DomainError {
  constructor(entity: string, id?: string) {
    const msg = id
      ? `${entity} with id '${id}' not found`
      : `${entity} not found`;
    super('NOT_FOUND', msg);
  }
}

/** 409 */
export class ConflictError extends DomainError {
  constructor(message: string = 'Resource state conflict') {
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
