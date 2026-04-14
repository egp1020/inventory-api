import { MOVEMENT_REPOSITORY } from '@shared/infrastructure/constants/repository.symbols';
import { Module } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { MovementRepositoryAdapter } from '@movements/infrastructure/adapters';
import {
  RegisterMovementUseCase,
  ListMovementsUseCase,
} from '@movements/application';
import { MovementsController } from './movements.controller';

@Module({
  controllers: [MovementsController],
  providers: [
    PrismaService,
    MovementRepositoryAdapter,
    {
      provide: MOVEMENT_REPOSITORY,
      useClass: MovementRepositoryAdapter,
    },
    RegisterMovementUseCase,
    ListMovementsUseCase,
  ],
  exports: [MOVEMENT_REPOSITORY],
})
export class MovementsModule {}
