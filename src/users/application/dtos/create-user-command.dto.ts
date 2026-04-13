import { Role } from '@prisma/client';

/**
 * DTO de entrada para el caso de uso CreateUserUseCase
 */
export class CreateUserCommandDto {
  email!: string;
  password!: string;
  role!: Role;
  warehouseId?: string | null;
}
