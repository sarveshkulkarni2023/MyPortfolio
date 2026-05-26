import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skillData = [
  {
    category: 'Programming Languages',
    description: 'Core languages used for systems programming, backend, and scripts.',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript / TypeScript', level: 90 },
      { name: 'Go', level: 85 },
      { name: 'C++', level: 80 },
      { name: 'Rust', level: 75 },
      { name: 'SQL', level: 90 },
      { name: 'Bash', level: 85 }
    ]
  },
  {
    category: 'AI & Machine Learning',
    description: 'Frameworks and libraries for intelligent systems and data science.',
    skills: [
      { name: 'TensorFlow', level: 85 },
      { name: 'PyTorch', level: 80 },
      { name: 'Scikit-learn', level: 90 },
      { name: 'Pandas & NumPy', level: 95 },
      { name: 'OpenCV', level: 80 },
      { name: 'NLP & LLMs', level: 75 }
    ]
  },
  {
    category: 'Cybersecurity & DevOps',
    description: 'Security engineering, penetration testing, and infrastructure automation.',
    skills: [
      { name: 'Penetration Testing', level: 85 },
      { name: 'Network Security (Nmap, Wireshark)', level: 90 },
      { name: 'Cryptography', level: 80 },
      { name: 'Docker & Kubernetes', level: 85 },
      { name: 'AWS Cloud', level: 80 },
      { name: 'Linux Operations', level: 95 }
    ]
  },
  {
    category: 'Web Engineering',
    description: 'Full-stack development for scalable web applications.',
    skills: [
      { name: 'React & Next.js', level: 90 },
      { name: 'Node.js & Express', level: 95 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Prisma ORM', level: 85 },
      { name: 'MySQL & PostgreSQL', level: 85 },
      { name: 'Three.js / React Three Fiber', level: 75 }
    ]
  }
];

async function main() {
  console.log('Seeding skills database...');

  // First clear existing skills and categories to avoid duplicates
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});

  for (let i = 0; i < skillData.length; i++) {
    const catData = skillData[i];
    
    // Create category
    const category = await prisma.skillCategory.create({
      data: {
        name: catData.category,
        skills: {
          create: catData.skills.map(s => ({
            name: s.name,
            proficiency: s.level
          }))
        }
      }
    });

    console.log(`Created category: ${category.name} with ${catData.skills.length} skills.`);
  }

  console.log('Skills seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
