import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';
import { PaginatedUserResultDto } from '../dtos';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(page: number, limit: number): Promise<PaginatedUserResultDto> {
    const { data: users, total } = await this.userRepository.findAll(page, limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email.getValue(),
        role: user.role,
        warehouseId: user.warehouseId,
        createdAt: user.createdAt,
        isActive: user.isActive(),
      })),
      page,
      limit,
      total,
      totalPages,
    };
  }
}
