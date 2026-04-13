import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * Domain-specific error for authentication.
 * Thrown when credentials do not match.
 */
export class InvalidCredentialsError extends DomainError {
  constructor(message: string = 'Email or password invalid') {
    super('UNAUTHORIZED', message);
  }
}

/**
 * Error when the refresh token is invalid or expired.
 */
export class InvalidRefreshTokenError extends DomainError {
  constructor(message: string = 'Refresh token invalid or expired') {
    super('UNAUTHORIZED', message);
  }
}

/**
 * Error when attempting to create a user with an email that already exists.
 */
export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('CONFLICT', `Email '${email}' is already registered`);
  }
}

/**
 * Error when a user is not active (soft deleted).
 */
export class UserInactiveError extends DomainError {
  constructor() {
    super('FORBIDDEN', 'User has been deactivated');
  }
}
