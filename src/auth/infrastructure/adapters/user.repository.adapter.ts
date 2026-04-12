import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { IUserRepository } from '../../domain/ports/user.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const userRaw = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return userRaw ? this.toDomain(userRaw) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userRaw = await this.prisma.user.findUnique({
      where: { id },
    });
    return userRaw ? this.toDomain(userRaw) : null;
  }

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

  async update(user: User): Promise<User> {
    const userRaw = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.getValue(),
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
