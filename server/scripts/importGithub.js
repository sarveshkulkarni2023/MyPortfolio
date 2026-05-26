import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const customRepoMetadata = {
  'AI-Cost-Leak-Killer': {
    title: 'AI Cost Leak Killer',
    category: 'AI/ML',
    description: 'An AI-powered cost optimization tool that scans cloud infrastructures to detect and stop resource leakages.',
    techStack: ['Python', 'Generative AI', 'Cloud Cost Management', 'Vercel'],
    featured: true,
  },
  'Reserve-ERP-An-Appoinment-Booking-System-Odoo_Hackathon': {
    title: 'Reserve ERP Appointment Booking',
    category: 'Full Stack',
    description: 'An advanced appointment booking system built for Odoo ERP hackathon, facilitating real-time scheduling.',
    techStack: ['TypeScript', 'Odoo ERP', 'React', 'Node.js'],
    featured: true,
  },
  'Reimbursement-management-Odoo-Hackathon': {
    title: 'Odoo Reimbursement Management',
    category: 'Full Stack',
    description: 'A digitized reimbursement claim system with automated workflows and approvals integrated with Odoo ERP.',
    techStack: ['TypeScript', 'Odoo ERP', 'React', 'Tailwind CSS'],
    featured: true,
  },
  'Cryptography-Information-Security': {
    title: 'Cryptography & InfoSec Suite',
    category: 'Cybersecurity',
    description: 'A collection of cryptographic algorithms, secure key exchanges, and cybersecurity simulation tools.',
    techStack: ['Python', 'Cryptography', 'AES', 'Security'],
    featured: true,
  },
  'Credit-Card-Fraud-Detection_ML-Project--2': {
    title: 'Credit Card Fraud Detector',
    category: 'AI/ML',
    description: 'Machine learning model utilizing anomaly detection to flag suspicious credit card transactions.',
    techStack: ['Python', 'Jupyter Notebook', 'Scikit-learn', 'Pandas'],
    featured: true,
  },
  'Spam-SMS-Detection_ML-Project--3': {
    title: 'Spam SMS Detector',
    category: 'AI/ML',
    description: 'A text-classification model that filters out spam messages using natural language processing (NLP).',
    techStack: ['Python', 'Jupyter Notebook', 'NLTK', 'Scikit-learn'],
  },
  'Movie_Genre_Classification_ML': {
    title: 'Movie Genre Classifier',
    category: 'AI/ML',
    description: 'An NLP model that classifies movie synopses into their respective genres.',
    techStack: ['Python', 'Jupyter Notebook', 'TF-IDF', 'Machine Learning'],
  },
  'TaskPilot-HackWithMumbai': {
    title: 'TaskPilot',
    category: 'Full Stack',
    description: 'A productivity and task allocation application designed and built for the HackWithMumbai hackathon.',
    techStack: ['Python', 'React', 'Flask', 'Sqlite'],
    featured: true,
  },
  'E-shop': {
    title: 'E-Shop Platform',
    category: 'Full Stack',
    description: 'A fully functional e-commerce storefront with product catalogs, shopping carts, and checkout features.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Node.js'],
  },
  'Library-Management-System': {
    title: 'Library Management System',
    category: 'Full Stack',
    description: 'A system to catalog books, track borrowers, manage library inventory, and handle reservations.',
    techStack: ['JavaScript', 'HTML5', 'CSS3', 'Node.js'],
  },
  'Online-Learning-Management-System': {
    title: 'Online LMS',
    category: 'Full Stack',
    description: 'A web-based learning management system featuring student portals, courses, and quiz modules.',
    techStack: ['PHP', 'MySQL', 'HTML5', 'CSS3'],
  },
  'SkillCertificationTracker': {
    title: 'Skill & Certification Tracker',
    category: 'Full Stack',
    description: 'A database-driven application to monitor skill development progress and verify professional certifications.',
    techStack: ['Java', 'SQL', 'React', 'Spring Boot'],
  },
  'vscode-file-uploader': {
    title: 'VSCode File Uploader',
    category: 'Open Source',
    description: 'A utility extension to easily upload files directly from VS Code to cloud hosting servers.',
    techStack: ['Python', 'VS Code API', 'OAuth', 'Cloud Storage'],
  }
};

const categoryThumbnails = {
  'AI/ML': 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
  'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  'Full Stack': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  'DevOps': 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80',
  'Open Source': 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80'
};

async function importGithubData() {
  const username = 'sarveshkulkarni2023';
  console.log(`Fetching data for ${username}...`);

  try {
    // 1. Fetch user data (for avatar)
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error('Failed to fetch user data');
    const userData = await userRes.json();
    
    console.log(`Found avatar URL: ${userData.avatar_url}`);

    // Update Admin User
    await prisma.user.updateMany({
      where: { role: 'ADMIN' },
      data: { avatar: userData.avatar_url },
    });
    console.log('Updated Admin User avatar.');

    // Delete existing projects to prevent clutter, doing a clean sync
    await prisma.project.deleteMany();
    console.log('Cleared existing projects from database.');

    // 2. Fetch repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!reposRes.ok) throw new Error('Failed to fetch repos');
    const repos = await reposRes.json();

    console.log(`Found ${repos.length} repositories.`);

    let sortOrder = 0;
    for (const repo of repos) {
      if (repo.fork) continue; // Skip forks
      if (repo.name === username) continue; // Skip the profile repository

      // Check if we have custom metadata for this project
      const customMeta = customRepoMetadata[repo.name];
      
      let category = 'Open Source';
      if (customMeta && customMeta.category) {
        category = customMeta.category;
      } else {
        // Auto-detect category
        const nameLower = repo.name.toLowerCase();
        if (nameLower.includes('ml') || nameLower.includes('detection') || nameLower.includes('classification') || nameLower.includes('genre') || nameLower.includes('cost-leak')) {
          category = 'AI/ML';
        } else if (nameLower.includes('security') || nameLower.includes('cryptography') || nameLower.includes('triage')) {
          category = 'Cybersecurity';
        } else if (nameLower.includes('shop') || nameLower.includes('store') || nameLower.includes('management') || nameLower.includes('booking') || nameLower.includes('system') || nameLower.includes('tracker')) {
          category = 'Full Stack';
        }
      }

      const title = customMeta?.title || repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
      const description = customMeta?.description || repo.description || 'A software repository developed on GitHub.';
      const techStackArr = customMeta?.techStack || (repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language || 'Various']);
      const thumbnail = categoryThumbnails[category] || categoryThumbnails['Open Source'];
      const featured = customMeta?.featured || false;

      const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const projectData = {
        title: title,
        slug: slug,
        description: description,
        longDesc: `<p><strong>${title}</strong> is a project imported directly from GitHub. Check the repository for setup instructions, commit history, and detailed structure.</p><p>${description}</p><p>Explore the full source code and contribute via the GitHub repository link below.</p>`,
        techStack: JSON.stringify(techStackArr),
        liveUrl: repo.homepage || null,
        repoUrl: repo.html_url,
        category: category,
        status: 'PUBLISHED',
        thumbnail: thumbnail,
        featured: featured,
        sortOrder: sortOrder++,
      };

      await prisma.project.create({
        data: projectData,
      });
      console.log(`Imported: ${projectData.title} | Category: ${category} | Featured: ${featured}`);
    }

    console.log('GitHub import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importGithubData();
