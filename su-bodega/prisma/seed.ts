import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'node:crypto';

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

const prisma = new PrismaClient();

async function main() {
  const vinoCategory = await prisma.productCategory.upsert({
    where: { slug: 'vino' },
    update: { name: 'Vino', isActive: true },
    create: { slug: 'vino', name: 'Vino', description: 'Catálogo principal de vinos' },
  });

  await prisma.productCategory.upsert({
    where: { slug: 'vino-guardado' },
    update: { name: 'Vinos Únicos', description: 'Selección especial de etiquetas únicas', isActive: true },
    create: { slug: 'vino-guardado', name: 'Vinos Únicos', description: 'Selección especial de etiquetas únicas' },
  });

  await prisma.productCategory.upsert({
    where: { slug: 'regaleria' },
    update: { name: 'Regalería', isActive: true },
    create: { slug: 'regaleria', name: 'Regalería', description: 'Regalos y accesorios de la bodega' },
  });

  const adminEmail = process.env.ADMIN_EMAIL || (process.env.NODE_ENV === 'production' ? '' : 'admin@bodega.com');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios para crear la cuenta admin');
  }
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        password: hashPassword(adminPassword),
        name: 'Administrador Su Bodega',
      },
    });
  }

  console.log('✅ Cuenta admin inicial verificada:', adminEmail);
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
