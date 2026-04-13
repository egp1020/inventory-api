import { Role } from '@prisma/client';

/**
 * DTO de entrada para el caso de uso UpdateUserUseCase
 */
export class UpdateUserCommandDto {
  email?: string;
  password?: string;
  role?: Role;
  warehouseId?: string | null;
}
