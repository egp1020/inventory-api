import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.port';
import { UserNotFoundError } from '../../domain/errors/user.errors';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}
