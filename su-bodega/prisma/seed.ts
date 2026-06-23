import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear cuenta de admin de prueba
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@bodega.com' },
    update: {},
    create: {
      email: 'admin@bodega.com',
      password: 'admin123',
      name: 'Administrador Su Bodega',
    },
  });

  console.log('✅ Cuenta de admin creada:', admin);
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
