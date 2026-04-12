import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../symbols';
import { UserNotFoundError } from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user.entity';
import { UserResultDto } from '../dtos';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResultDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return this.mapToUserResultDto(user);
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
