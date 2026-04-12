import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(page: number, limit: number): Promise<{ data: User[]; total: number }> {
    return this.userRepository.findAll(page, limit);
  }
}
