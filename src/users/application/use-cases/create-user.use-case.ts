import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import {
  USER_REPOSITORY,
  WAREHOUSE_VALIDATOR,
} from '../../domain/ports/user.repository.port';
import type { IWarehouseValidator } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import {
  UserAlreadyExistsError,
  WarehouseNotFoundError,
} from '../../domain/errors/user.errors';
import type { IPasswordHasher } from '../../../auth/application/ports/password-hasher.port';
import { PASSWORD_HASHER } from '../../../auth/application/ports/password-hasher.port';
import { CreateUserCommandDto, UserResultDto } from '../dtos';

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

  async execute(command: CreateUserCommandDto): Promise<UserResultDto> {
    // 1. Check that email does not exist
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new UserAlreadyExistsError(command.email);
    }

    // 2. If OPERATOR, validate that warehouse exists
    if (command.role === 'OPERATOR' && command.warehouseId) {
      const warehouseExists = await this.warehouseValidator.existsAndIsActive(
        command.warehouseId,
      );
      if (!warehouseExists) {
        throw new WarehouseNotFoundError(command.warehouseId);
      }
    }

    // 3. Hash password
    const passwordHash = await this.passwordHasher.hash(command.password);

    // 4. Create user
    const user = User.create({
      id: randomUUID(),
      email: command.email,
      passwordHash,
      role: command.role,
      warehouseId:
        command.role === 'OPERATOR' ? command.warehouseId || null : null,
      createdAt: new Date(),
    });

    user.validateWarehouseAssignment(user.warehouseId);

    // 5. Persist
    const createdUser = await this.userRepository.create(user);

    return this.mapToUserResultDto(createdUser);
  }

  private mapToUserResultDto(user: User): UserResultDto {
    return {
      id: user.id,
      email: user.email.getValue(),
      role: user.role,
      warehouseId: user.warehouseId,
      createdAt: user.createdAt,
      isActive: user.isActive(),
    };
  }
}
