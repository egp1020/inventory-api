import { Role } from '@prisma/client';

/**
 * DTO de salida para listados paginados de usuarios
 */
export class PaginatedUserResultDto {
  data!: Array<{
    id: string;
    email: string;
    role: Role;
    warehouseId: string | null;
    createdAt: Date;
    isActive: boolean;
  }>;
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}
