import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * Error when attempting to create a user with an email that already exists.
 */
export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('CONFLICT', `User with email '${email}' already exists`);
  }
}

/**
 * Error when attempting to update a user that does not exist.
 */
export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `User with id '${id}' not found`);
  }
}

/**
 * Error when an OPERATOR attempts to assign a warehouse that does not exist.
 */
export class WarehouseNotFoundError extends DomainError {
  constructor(id: string) {
    super('NOT_FOUND', `Warehouse with id '${id}' not found`);
  }
}

/**
 * Error when attempting to reassign warehouse to a user that is not OPERATOR.
 */
export class InvalidRoleForWarehouseError extends DomainError {
  constructor() {
    super(
      'UNPROCESSABLE',
      'Only users with OPERATOR role can have an assigned warehouse',
    );
  }
}

/**
 * Error when an OPERATOR attempts to access resources from another warehouse.
 */
export class ForbiddenOperatorError extends DomainError {
  constructor(message: string = 'You do not have access to this warehouse') {
    super('FORBIDDEN', message);
  }
}
