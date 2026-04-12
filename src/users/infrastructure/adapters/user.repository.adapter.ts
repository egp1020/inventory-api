import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import type { IUserRepository } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const userRaw = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email.getValue(),
        passwordHash: user.passwordHash,
        role: user.role,
        warehouseId: user.warehouseId,
      },
    });
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
    const userRaw = await this.prisma.user.update({
      where: { id },
      data: {
        email: user.email?.getValue(),
        role: user.role,
        warehouseId: user.warehouseId,
      },
    });
    return this.toDomain(userRaw);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
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
