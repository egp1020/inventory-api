/**
 * Value Object para Password.
 * Encapsula lógica de validación de contraseña a nivel de dominio.
 * Las contraseñas se almacenan hasheadas en la infraestructura.
 */
export class Password {
  private readonly value: string;

  private static readonly MIN_LENGTH = 6;

  constructor(plainPassword: string) {
    if (!this.isValid(plainPassword)) {
      throw new Error(
        `Contraseña inválida. Mínimo ${Password.MIN_LENGTH} caracteres.`,
      );
    }
    this.value = plainPassword;
  }

  private isValid(password: string): boolean {
    return password.length >= Password.MIN_LENGTH;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Password): boolean {
    return this.value === other.value;
  }
}
