import { Module } from '@nestjs/common';
import { PrismaModule } from '@database/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

// Application
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';

// Domain Ports
import {
  USER_REPOSITORY,
  WAREHOUSE_VALIDATOR,
} from './domain/ports/user.repository.port';

// Infrastructure
import { UserRepositoryAdapter } from './infrastructure/adapters/user.repository.adapter';
import { WarehouseValidatorAdapter } from './infrastructure/adapters/warehouse.validator.adapter';

// Interface
import { UsersController } from './interface/users.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,

    // Ports → Adapters (Dependency Injection)
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryAdapter,
    },
    {
      provide: WAREHOUSE_VALIDATOR,
      useClass: WarehouseValidatorAdapter,
    },
  ],
})
export class UsersModule {}
