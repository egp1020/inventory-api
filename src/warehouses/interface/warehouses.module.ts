import { Module } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { WarehouseRepositoryAdapter } from '@warehouses/infrastructure';
import {
  CreateWarehouseUseCase,
  GetWarehouseByIdUseCase,
  UpdateWarehouseUseCase,
  ListWarehousesUseCase,
  DeleteWarehouseUseCase,
  WAREHOUSE_REPOSITORY,
} from '@warehouses/application';
import { WarehouseController } from './warehouses.controller';

@Module({
  controllers: [WarehouseController],
  providers: [
    PrismaService,
    WarehouseRepositoryAdapter,
    {
      provide: WAREHOUSE_REPOSITORY,
      useClass: WarehouseRepositoryAdapter,
    },
    CreateWarehouseUseCase,
    GetWarehouseByIdUseCase,
    UpdateWarehouseUseCase,
    ListWarehousesUseCase,
    DeleteWarehouseUseCase,
  ],
  exports: [WAREHOUSE_REPOSITORY],
})
export class WarehousesModule {}
