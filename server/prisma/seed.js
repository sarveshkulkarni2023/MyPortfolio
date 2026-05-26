import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL || 'sarvesh@admin.com';
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!password) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('INITIAL_ADMIN_PASSWORD environment variable must be set for production database seeding.');
    }
    console.warn('⚠️ WARNING: INITIAL_ADMIN_PASSWORD not set. Seeding with default local development password.');
  }

  const finalPassword = password || 'Shrinivas@1616';
  const hashedPassword = await bcrypt.hash(finalPassword, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✓ Admin user seeded (${email} / ${password ? 'Environment Configured' : 'Local Default Used'})`);

  // Seed skill categories
  const categories = ['AI & Machine Learning', 'Cybersecurity', 'Full Stack', 'DevOps & Cloud'];
  for (const name of categories) {
    await prisma.skillCategory.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('✓ Skill categories seeded');

  console.log('⚡ Database seeded successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
