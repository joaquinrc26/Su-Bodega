import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const vinoCategory = await prisma.productCategory.upsert({
    where: { slug: 'vino' },
    update: { name: 'Vino', isActive: true },
    create: { slug: 'vino', name: 'Vino', description: 'Catálogo principal de vinos' },
  });

  await prisma.productCategory.upsert({
    where: { slug: 'vino-guardado' },
    update: { name: 'Vino Guardado', isActive: true },
    create: { slug: 'vino-guardado', name: 'Vino Guardado', description: 'Selección de vinos con guarda' },
  });

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
  console.log('✅ Categoría base creada:', vinoCategory);
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
