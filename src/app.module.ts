import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@database/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WarehousesModule } from './warehouses/interface/warehouses.module';
import { ProductsModule } from './products/interface/products.module';
import { MovementsModule } from './movements/interface/movements.module';
import { ReportsModule } from './reports/interface/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WarehousesModule,
    ProductsModule,
    MovementsModule,
    ReportsModule,
  ],
})
export class AppModule {}
