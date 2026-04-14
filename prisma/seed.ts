import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  const operator = await prisma.user.create({
    data: {
      email: 'operator@test.com',
      passwordHash: hashedPassword,
      role: 'OPERATOR',
    },
  });
  console.log('✅ Operator user created:', operator.email);

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse',
      location: 'New York',
      capacity: 5000,
    },
  });
  console.log('✅ Warehouse 1 created:', warehouse1.name);

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Secondary Warehouse',
      location: 'Los Angeles',
      capacity: 3000,
    },
  });
  console.log('✅ Warehouse 2 created:', warehouse2.name);

  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      sku: 'LAP-001',
      description: 'Dell Laptop XPS',
      unit: 'units',
      minStockAlert: 5,
    },
  });
  console.log('✅ Product 1 created:', product1.name);

  const product2 = await prisma.product.create({
    data: {
      name: 'Mouse',
      sku: 'MOU-001',
      description: 'Wireless Mouse',
      unit: 'units',
      minStockAlert: 10,
    },
  });
  console.log('✅ Product 2 created:', product2.name);

  const movement1 = await prisma.stockMovement.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      userId: admin.id,
      type: 'ENTRADA',
      quantity: 50,
      notes: 'Initial stock',
    },
  });
  console.log('✅ Movement 1 created:', movement1.id);

  const movement2 = await prisma.stockMovement.create({
    data: {
      productId: product2.id,
      warehouseId: warehouse1.id,
      userId: admin.id,
      type: 'ENTRADA',
      quantity: 200,
      notes: 'Bulk order',
    },
  });
  console.log('✅ Movement 2 created:', movement2.id);

  const movement3 = await prisma.stockMovement.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      userId: admin.id,
      type: 'SALIDA',
      quantity: 10,
      notes: 'Sale to customer',
    },
  });
  console.log('✅ Movement 3 created:', movement3.id);

  console.log('\n✅ Seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Admin: admin@test.com / password123');
  console.log('  Operator: operator@test.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
