import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      nama: 'Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✓ Admin user created:', admin);

  // Insert sample sensor data
  const sampleData = Array.from({ length: 20 }, (_, i) => ({
    ph: 7.0 + Math.random() * 2,
    tds: Math.floor(350 + Math.random() * 200),
    suhu: 26 + Math.random() * 4,
  }));

  await prisma.dataSensor.createMany({
    data: sampleData,
    skipDuplicates: true,
  });

  console.log('✓ Sample sensor data created:', sampleData.length, 'records');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
