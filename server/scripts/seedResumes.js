import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resumesData = [
  {
    title: 'AI/ML Engineer Resume',
    category: 'AI/ML',
    driveUrl: 'https://drive.google.com/file/d/1HkuhE-3UA7n45GJzbllNHl2h7okSkWSY/view?usp=sharing',
  },
  {
    title: 'Software Development Engineer Resume',
    category: 'Full Stack',
    driveUrl: 'https://drive.google.com/file/d/16xESoEs1gDs8QAvQP-AgfFBKU77SlhBJ/view?usp=sharing',
  },
  {
    title: 'Cybersecurity Engineer Resume',
    category: 'Cybersecurity',
    driveUrl: 'https://drive.google.com/file/d/1ToGY62vNc-NuDiyP4HwczPj6K4TnimaB/view?usp=sharing',
  }
];

async function main() {
  console.log('Seeding resumes...');

  await prisma.resume.deleteMany({});

  for (const resume of resumesData) {
    const created = await prisma.resume.create({
      data: resume
    });
    console.log(`Created resume: ${created.title}`);
  }

  console.log('Resumes seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
