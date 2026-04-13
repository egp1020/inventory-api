import { Role } from '@prisma/client';

/**
 * DTO de salida para los casos de uso de usuario
 * Representa un usuario en respuesta de la application
 */
export class UserResultDto {
  id!: string;
  email!: string;
  role!: Role;
  warehouseId!: string | null;
  createdAt!: Date;
  isActive!: boolean;
}
