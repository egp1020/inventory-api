/**
 * Port para funciones criptográficas de password.
 * La aplicación no conoce si usa bcrypt, argon2, etc.
 */
export interface IPasswordHasher {
  /**
   * Hash una contraseña en texto plano.
   */
  hash(plainPassword: string): Promise<string>;

  /**
   * Compara una contraseña en texto plano con su hash.
   */
  compare(plainPassword: string, hash: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
