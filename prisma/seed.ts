// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@umrahfi.com' },
    update: {},
    create: {
      email: 'admin@umrahfi.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      verified: true,
    },
  });

  // Create countries
  const saudiArabia = await prisma.country.upsert({
    where: { code: 'SA' },
    update: {},
    create: {
      name: 'Saudi Arabia',
      code: 'SA',
      flagUrl: '/flags/sa.svg',
    },
  });

  // Create cities
  await prisma.city.upsert({
    where: { id: 'makkah-city' },
    update: {},
    create: {
      id: 'makkah-city',
      name: 'Makkah',
      countryId: saudiArabia.id,
    },
  });

  await prisma.city.upsert({
    where: { id: 'madinah-city' },
    update: {},
    create: {
      id: 'madinah-city',
      name: 'Madinah',
      countryId: saudiArabia.id,
    },
  });

  // Add more seed data as needed

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });