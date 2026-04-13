/**
 * DTO de entrada para el caso de uso LoginUseCase
 * Representa el comando de login que la application recibe
 */
export class LoginCommandDto {
  email!: string;
  password!: string;
}
