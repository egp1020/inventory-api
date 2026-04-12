import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed de base de datos...');

  // Limpiar datos existentes
  console.log('🗑️ Cleaning previous data previos...');
  await prisma.stockMovement.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.warehouse.deleteMany({});

  // 1. Create ADMIN user
  console.log('👤 Creating user ADMIN...');
  const adminHashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminHashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✓ ADMIN created: ${admin.email}`);

  // 2. Create 2 warehouses
  console.log('📦 Creating 2 warehouses...');
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Almacén Central',
      location: 'Bogotá, Colombia',
      capacity: 10000,
      isActive: true,
    },
  });
  console.log(`✓ Warehouse 1: ${warehouse1.name}`);

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Almacén Regional',
      location: 'Medellín, Colombia',
      capacity: 5000,
      isActive: true,
    },
  });
  console.log(`✓ Warehouse 2: ${warehouse2.name}`);

  // 3. Create OPERATOR user assigned a warehouse1
  console.log('👤 Creating user OPERATOR...');
  const operatorHashedPassword = await bcrypt.hash('operator123', 10);
  const operator = await prisma.user.create({
    data: {
      email: 'operator@example.com',
      passwordHash: operatorHashedPassword,
      role: 'OPERATOR',
      warehouseId: warehouse1.id,
    },
  });
  console.log(
    `✓ OPERATOR created: ${operator.email} (assigned a ${warehouse1.name})`,
  );

  // 4. Create 5 products
  console.log('🏷️ Creating 5 products...');
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'LAPTOP001',
        name: 'Laptop ProBook',
        description: 'Laptop de alto rendimiento',
        unit: 'unidad',
        minStockAlert: 50,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MONITOR-27',
        name: 'Monitor 27"',
        description: 'Monitor FHD 27 pulgadas',
        unit: 'unidad',
        minStockAlert: 30,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'TECLADO001',
        name: 'Teclado Mecánico',
        description: 'Teclado mecánico RGB',
        unit: 'unidad',
        minStockAlert: 100,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MOUSE-WIRELESS',
        name: 'Mouse Inalámbrico',
        description: 'Mouse inalámbrico 2.4GHz',
        unit: 'unidad',
        minStockAlert: 150,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'CABLE-HDMI-2',
        name: 'Cable HDMI 2.0',
        description: 'Cable HDMI 2.0 certificado',
        unit: 'metro',
        minStockAlert: 50,
      },
    }),
  ]);

  products.forEach((p) => console.log(`✓ ${p.sku} - ${p.name}`));

  // 5. Create initial movements (ENTRADA)
  console.log('📊 Creating movements iniciales...');

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const movements = await Promise.all([
    // Warehouse 1: Initial stock alto
    prisma.stockMovement.create({
      data: {
        productId: products[0].id, // LAPTOP001
        warehouseId: warehouse1.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 500,
        notes: 'Initial stock',
        createdAt: threeDaysAgo,
      },
    }),
    // Warehouse 1: Monitor
    prisma.stockMovement.create({
      data: {
        productId: products[1].id, // MONITOR-27
        warehouseId: warehouse1.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 300,
        notes: 'Compra a proveedor',
        createdAt: threeDaysAgo,
      },
    }),
    // Warehouse 1: Teclados
    prisma.stockMovement.create({
      data: {
        productId: products[2].id, // TECLADO001
        warehouseId: warehouse1.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 1000,
        notes: 'Gran compra',
        createdAt: threeDaysAgo,
      },
    }),
    // Warehouse 1: Mice
    prisma.stockMovement.create({
      data: {
        productId: products[3].id, // MOUSE-WIRELESS
        warehouseId: warehouse1.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 2000,
        notes: 'Entrada masiva',
        createdAt: threeDaysAgo,
      },
    }),
    // Warehouse 1: Cable
    prisma.stockMovement.create({
      data: {
        productId: products[4].id, // CABLE-HDMI-2
        warehouseId: warehouse1.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 500,
        notes: 'Metros iniciales',
        createdAt: threeDaysAgo,
      },
    }),

    // Warehouse 2: Initial stock
    prisma.stockMovement.create({
      data: {
        productId: products[0].id, // LAPTOP001
        warehouseId: warehouse2.id,
        userId: admin.id,
        type: 'ENTRADA',
        quantity: 200,
        notes: 'Stock regional',
        createdAt: threeDaysAgo,
      },
    }),

    // Warehouse 1: Salida (Laptop)
    prisma.stockMovement.create({
      data: {
        productId: products[0].id, // LAPTOP001
        warehouseId: warehouse1.id,
        userId: operator.id,
        type: 'SALIDA',
        quantity: 100,
        notes: 'Venta a cliente corporate',
        createdAt: yesterday,
      },
    }),

    // Warehouse 1: Salida (Monitor)
    prisma.stockMovement.create({
      data: {
        productId: products[1].id, // MONITOR-27
        warehouseId: warehouse1.id,
        userId: operator.id,
        type: 'SALIDA',
        quantity: 50,
        notes: 'Venta minorista',
        createdAt: yesterday,
      },
    }),

    // Warehouse 1: Salida (Mouse) - para generar alerta bajo stock
    prisma.stockMovement.create({
      data: {
        productId: products[3].id, // MOUSE-WIRELESS
        warehouseId: warehouse1.id,
        userId: operator.id,
        type: 'SALIDA',
        quantity: 1900,
        notes: 'Liquidación de stock',
        createdAt: now,
      },
    }),
  ]);

  console.log(`✓ ${movements.length} movimientos createds`);

  console.log('\n✅ Seed completed exitosamente');
  console.log('\n📋 Datos de prueba:');
  console.log('┌─────────────────────────────────────┐');
  console.log('│ ADMIN');
  console.log(`│ Email: ${admin.email}`);
  console.log('│ Contraseña: admin123');
  console.log('├─────────────────────────────────────┤');
  console.log('│ OPERATOR');
  console.log(`│ Email: ${operator.email}`);
  console.log('│ Contraseña: operator123');
  console.log('├─────────────────────────────────────┤');
  console.log('│ BODEGAS: 2 activas');
  console.log('│ PRODUCTOS: 5 SKUs');
  console.log('│ MOVIMIENTOS: Múltiples entradas/salidas');
  console.log('└─────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
