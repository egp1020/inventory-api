import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../symbols';
import { UserNotFoundError } from '../../domain/errors/user.errors';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // 1. Verificar que el usuario existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // 2. Soft delete
    await this.userRepository.softDelete(id);
  }
}
