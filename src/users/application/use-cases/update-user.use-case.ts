import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY, type IWarehouseValidator, WAREHOUSE_VALIDATOR } from '../../domain/ports/user.repository.port';
import { UserNotFoundError, WarehouseNotFoundError } from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user.entity';
import { Role } from '@prisma/client';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(WAREHOUSE_VALIDATOR)
    private readonly warehouseValidator: IWarehouseValidator,
  ) {}

  async execute(input: {
    id: string;
    email?: string;
    role?: Role;
    warehouseId?: string | null;
  }): Promise<User> {
    // 1. Verificar que el usuario existe
    const user = await this.userRepository.findById(input.id);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    // 2. Si se cambia email, verificar que no exista otro con ese email
    if (input.email && input.email !== user.email.getValue()) {
      const exists = await this.userRepository.existsByEmailExcludingId(input.email, input.id);
      if (exists) {
        throw new UserNotFoundError(input.email);
      }
    }

    // 3. Si es OPERATOR y se asigna bodega, validar
    const newRole = input.role ?? user.role;
    const newWarehouseId = input.warehouseId !== undefined ? input.warehouseId : user.warehouseId;

    if (newRole === 'OPERATOR' && newWarehouseId) {
      const warehouseExists = await this.warehouseValidator.existsAndIsActive(newWarehouseId);
      if (!warehouseExists) {
        throw new WarehouseNotFoundError(newWarehouseId);
      }
    }

    // 4. Crear versión actualizada
    const updatedUser = user.with({
      email: input.email,
      role: input.role,
      warehouseId: newRole === 'OPERATOR' ? newWarehouseId : null,
    });

    updatedUser.validateWarehouseAssignment(updatedUser.warehouseId);

    // 5. Persistir
    return this.userRepository.update(input.id, updatedUser);
  }
}
