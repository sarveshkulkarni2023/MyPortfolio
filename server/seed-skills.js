import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoSkills = [
  {
    category: "Programming Languages",
    skills: [
      { name: "Python", proficiency: 90 },
      { name: "Java", proficiency: 85 },
      { name: "C++", proficiency: 90 },
      { name: "JavaScript", proficiency: 95 },
      { name: "TypeScript", proficiency: 90 },
      { name: "SQL", proficiency: 85 },
      { name: "Bash", proficiency: 80 }
    ]
  },
  {
    category: "AI & Machine Learning",
    skills: [
      { name: "TensorFlow", proficiency: 85 },
      { name: "PyTorch", proficiency: 85 },
      { name: "Scikit-learn", proficiency: 90 },
      { name: "OpenCV", proficiency: 80 },
      { name: "Generative AI", proficiency: 85 },
      { name: "Transformer Models", proficiency: 85 },
      { name: "Pandas", proficiency: 90 },
      { name: "NumPy", proficiency: 90 },
      { name: "LangChain", proficiency: 85 },
      { name: "Hugging Face", proficiency: 85 }
    ]
  },
  {
    category: "Cybersecurity",
    skills: [
      { name: "Penetration Testing", proficiency: 90 },
      { name: "Vulnerability Assessment", proficiency: 85 },
      { name: "Network Security", proficiency: 85 },
      { name: "Web Application Security", proficiency: 90 },
      { name: "OWASP Top 10", proficiency: 90 },
      { name: "Linux Security", proficiency: 85 },
      { name: "SIEM Fundamentals", proficiency: 80 },
      { name: "Wireshark", proficiency: 85 },
      { name: "Burp Suite", proficiency: 85 },
      { name: "Nmap", proficiency: 90 },
      { name: "Metasploit", proficiency: 80 }
    ]
  },
  {
    category: "Web Engineering",
    skills: [
      { name: "React.js", proficiency: 95 },
      { name: "Next.js", proficiency: 90 },
      { name: "Node.js", proficiency: 90 },
      { name: "Express.js", proficiency: 90 },
      { name: "Tailwind CSS", proficiency: 95 },
      { name: "Prisma ORM", proficiency: 85 },
      { name: "REST APIs", proficiency: 95 },
      { name: "JWT Authentication", proficiency: 90 },
      { name: "MongoDB", proficiency: 85 },
      { name: "PostgreSQL", proficiency: 85 },
      { name: "MySQL", proficiency: 85 },
      { name: "Three.js", proficiency: 80 },
      { name: "React Three Fiber", proficiency: 80 }
    ]
  },
  {
    category: "DevOps & Cloud",
    skills: [
      { name: "Docker", proficiency: 85 },
      { name: "Kubernetes", proficiency: 75 },
      { name: "GitHub Actions", proficiency: 85 },
      { name: "CI/CD", proficiency: 85 },
      { name: "Linux", proficiency: 90 },
      { name: "AWS", proficiency: 80 },
      { name: "Nginx", proficiency: 80 },
      { name: "Shell Scripting", proficiency: 85 },
      { name: "Vercel", proficiency: 90 },
      { name: "Netlify", proficiency: 90 }
    ]
  }
];

async function main() {
  // Clear existing skills and categories to do a fresh seed
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  for (const cat of demoSkills) {
    const categoryRecord = await prisma.skillCategory.create({
      data: { name: cat.category },
    });

    for (const skill of cat.skills) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          proficiency: skill.proficiency,
          categoryId: categoryRecord.id
        }
      });
    }
  }
  console.log('Skills seeded successfully with new structure!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
