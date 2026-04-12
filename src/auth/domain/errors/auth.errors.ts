import { DomainError } from '@shared/domain/errors/domain.errors';

/**
 * Error específico del dominio de autenticación.
 * Se lanza cuando las credenciales no coinciden.
 */
export class InvalidCredentialsError extends DomainError {
  constructor(message: string = 'Email o contraseña inválidos') {
    super('UNAUTHORIZED', message);
  }
}

/**
 * Error cuando el refresh token es inválido o expiró.
 */
export class InvalidRefreshTokenError extends DomainError {
  constructor(message: string = 'Refresh token inválido o expirado') {
    super('UNAUTHORIZED', message);
  }
}

/**
 * Error cuando se intenta crear un usuario con un email que ya existe.
 */
export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super('CONFLICT', `El email '${email}' ya está registrado`);
  }
}

/**
 * Error cuando un usuario no está activo (soft deleted).
 */
export class UserInactiveError extends DomainError {
  constructor() {
    super('FORBIDDEN', 'El usuario ha sido desactivado');
  }
}
