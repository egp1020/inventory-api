import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  private readonly logger = new Logger(UserRepositoryAdapter.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    this.logger.debug(
      `Creating usuario: email=${user.email.getValue()}, rol=${user.role}`,
    );
    const userRaw = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.getValue(),
        passwordHash: user.passwordHash,
        role: user.role,
        warehouseId: user.warehouseId,
      },
    });
    this.logger.log(
      `Usuario created: id=${user.id}, email=${user.email.getValue()}`,
    );
    return this.toDomain(userRaw);
  }

  async findById(id: string): Promise<User | null> {
    const userRaw = await this.prisma.user.findUnique({
      where: { id },
    });
    return userRaw ? this.toDomain(userRaw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userRaw = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return userRaw ? this.toDomain(userRaw) : null;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [usersRaw, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data: usersRaw.map((u) => this.toDomain(u)),
      total,
    };
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    this.logger.debug(`Updating user: id=${id}`);
    const userRaw = await this.prisma.user.update({
      where: { id },
      data: {
        email: user.email?.getValue(),
        role: user.role,
        warehouseId: user.warehouseId,
      },
    });
    this.logger.log(`Usuario updated: id=${id}, email=${userRaw.email}`);
    return this.toDomain(userRaw);
  }

  async softDelete(id: string): Promise<void> {
    this.logger.debug(`Deleting user (soft delete): id=${id}`);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`Usuario deleted (soft delete): id=${id}`);
  }

  async existsByEmailExcludingId(
    email: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email: email.toLowerCase(),
        id: { not: excludeId },
        deletedAt: null,
      },
    });
    return count > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(userRaw: any): User {
    return User.create({
      id: userRaw.id,
      email: userRaw.email,
      passwordHash: userRaw.passwordHash,
      role: userRaw.role,
      warehouseId: userRaw.warehouseId,
      createdAt: userRaw.createdAt,
      deletedAt: userRaw.deletedAt,
    });
  }
}
