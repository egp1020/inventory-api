import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY, WAREHOUSE_VALIDATOR } from '../../domain/ports/user.repository.port';
import type { IWarehouseValidator } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { UserAlreadyExistsError, WarehouseNotFoundError } from '../../domain/errors/user.errors';
import type { IPasswordHasher } from '../../../auth/application/ports/password-hasher.port';
import { PASSWORD_HASHER } from '../../../auth/application/ports/password-hasher.port';
import { Role } from '@prisma/client';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(WAREHOUSE_VALIDATOR)
    private readonly warehouseValidator: IWarehouseValidator,
  ) {}

  async execute(input: {
    email: string;
    password: string;
    role: Role;
    warehouseId?: string | null;
  }): Promise<User> {
    // 1. Verificar que el email no exista
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    // 2. Si es OPERATOR, validar que la bodega existe
    if (input.role === 'OPERATOR' && input.warehouseId) {
      const warehouseExists = await this.warehouseValidator.existsAndIsActive(input.warehouseId);
      if (!warehouseExists) {
        throw new WarehouseNotFoundError(input.warehouseId);
      }
    }

    // 3. Hash la contraseña
    const passwordHash = await this.passwordHasher.hash(input.password);

    // 4. Crear usuario
    const user = User.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      role: input.role,
      warehouseId: input.role === 'OPERATOR' ? input.warehouseId || null : null,
      createdAt: new Date(),
    });

    user.validateWarehouseAssignment(user.warehouseId);

    // 5. Persistir
    return this.userRepository.create(user);
  }
}

