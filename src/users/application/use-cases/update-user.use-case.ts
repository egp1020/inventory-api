import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import {
  USER_REPOSITORY,
  type IWarehouseValidator,
  WAREHOUSE_VALIDATOR,
} from '../../domain/ports/user.repository.port';
import {
  UserNotFoundError,
  WarehouseNotFoundError,
} from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user.entity';
import { UpdateUserCommandDto, UserResultDto } from '../dtos';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(WAREHOUSE_VALIDATOR)
    private readonly warehouseValidator: IWarehouseValidator,
  ) {}

  async execute(
    id: string,
    command: UpdateUserCommandDto,
  ): Promise<UserResultDto> {
    // 1. Check that the user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // 2. If email changes, verify no other user has that email
    if (command.email && command.email !== user.email.getValue()) {
      const exists = await this.userRepository.existsByEmailExcludingId(
        command.email,
        id,
      );
      if (exists) {
        throw new UserNotFoundError(command.email);
      }
    }

    // 3. If OPERATOR role and warehouse is assigned, validate
    const newRole = command.role ?? user.role;
    const newWarehouseId =
      command.warehouseId !== undefined
        ? command.warehouseId
        : user.warehouseId;

    if (newRole === 'OPERATOR' && newWarehouseId) {
      const warehouseExists =
        await this.warehouseValidator.existsAndIsActive(newWarehouseId);
      if (!warehouseExists) {
        throw new WarehouseNotFoundError(newWarehouseId);
      }
    }

    // 4. Create updated version
    const updatedUser = user.with({
      email: command.email,
      role: command.role,
      warehouseId: newRole === 'OPERATOR' ? newWarehouseId : null,
    });

    updatedUser.validateWarehouseAssignment(updatedUser.warehouseId);

    // 5. Persist
    const result = await this.userRepository.update(id, updatedUser);

    return this.mapToUserResultDto(result);
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
