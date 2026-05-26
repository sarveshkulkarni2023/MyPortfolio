import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsService } from '../../services/dataService';
import {
  SiPython, SiCplusplus, SiJavascript, SiTypescript, SiMysql, SiGnubash,
  SiTensorflow, SiPytorch, SiScikitlearn, SiOpencv, SiOpenai, SiPandas, SiNumpy, SiHuggingface,
  SiKalilinux, SiWireshark, SiBurpsuite,
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTailwindcss, SiPrisma, SiMongodb, SiPostgresql, SiThreedotjs,
  SiDocker, SiKubernetes, SiGithubactions, SiLinux, SiNginx, SiVercel, SiNetlify
} from "react-icons/si";
import { FaCode, FaAws, FaJava } from 'react-icons/fa';

const skillIcons = {
  // Programming Languages
  "Python": <SiPython />,
  "Java": <FaJava />,
  "C++": <SiCplusplus />,
  "JavaScript": <SiJavascript />,
  "TypeScript": <SiTypescript />,
  "SQL": <SiMysql />,
  "Bash": <SiGnubash />,

  // AI & ML
  "TensorFlow": <SiTensorflow />,
  "PyTorch": <SiPytorch />,
  "Scikit-learn": <SiScikitlearn />,
  "OpenCV": <SiOpencv />,
  "Generative AI": <SiOpenai />,
  "Transformer Models": <SiHuggingface />,
  "Pandas": <SiPandas />,
  "NumPy": <SiNumpy />,
  "LangChain": <SiPython />,
  "Hugging Face": <SiHuggingface />,

  // Cybersecurity
  "Penetration Testing": <SiKalilinux />,
  "Vulnerability Assessment": <SiKalilinux />,
  "Network Security": <SiWireshark />,
  "Web Application Security": <SiBurpsuite />,
  "OWASP Top 10": <FaCode />,
  "Linux Security": <SiLinux />,
  "SIEM Fundamentals": <FaCode />,
  "Wireshark": <SiWireshark />,
  "Burp Suite": <SiBurpsuite />,
  "Nmap": <FaCode />,
  "Metasploit": <FaCode />,

  // Web Engineering
  "React.js": <SiReact />,
  "Next.js": <SiNextdotjs />,
  "Node.js": <SiNodedotjs />,
  "Express.js": <SiExpress />,
  "Tailwind CSS": <SiTailwindcss />,
  "Prisma ORM": <SiPrisma />,
  "REST APIs": <FaCode />,
  "JWT Authentication": <FaCode />,
  "MongoDB": <SiMongodb />,
  "PostgreSQL": <SiPostgresql />,
  "MySQL": <SiMysql />,
  "Three.js": <SiThreedotjs />,
  "React Three Fiber": <SiThreedotjs />,

  // DevOps & Cloud
  "Docker": <SiDocker />,
  "Kubernetes": <SiKubernetes />,
  "GitHub Actions": <SiGithubactions />,
  "CI/CD": <SiGithubactions />,
  "Linux": <SiLinux />,
  "AWS": <FaAws />,
  "Nginx": <SiNginx />,
  "Shell Scripting": <SiGnubash />,
  "Vercel": <SiVercel />,
  "Netlify": <SiNetlify />
};

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

const skillCategories = [
  "All",
  "Programming Languages",
  "AI & Machine Learning",
  "Cybersecurity",
  "Web Engineering",
  "DevOps & Cloud"
];

export default function SkillsSection() {
  const [skillGroups, setSkillGroups] = useState(demoSkills);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    skillsService.getAll().then(({ data }) => { 
      if (data.skills?.length) {
        // Only override if the backend actually has our new structure,
        // otherwise rely on demoSkills to avoid messy mixed state.
        const dbCategories = data.skills.map(s => s.category);
        const hasNewCategories = dbCategories.includes('Web Engineering');
        if (hasNewCategories) {
          setSkillGroups(data.skills); 
        }
      }
    }).catch(() => {});
  }, []);

  let displayedSkills = [];
  if (activeCategory === 'All') {
    const groups = skillGroups.map(g => [...g.skills]);
    while (displayedSkills.length < 15) {
      let addedAny = false;
      for (const group of groups) {
        if (group.length > 0) {
          displayedSkills.push(group.shift());
          addedAny = true;
          if (displayedSkills.length === 15) break;
        }
      }
      if (!addedAny) break;
    }
  } else {
    displayedSkills = skillGroups.find(g => g.category === activeCategory)?.skills || [];
  }

  return (
    <section id="skills" className="py-24 relative bg-cyber-black min-h-[500px]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        
        <h2 className="text-3xl md:text-5xl font-sans font-bold text-white mb-4">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Skills</span>
        </h2>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
          Building intelligent systems, secure infrastructures, and immersive digital experiences.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {skillCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-sans font-medium transition-all duration-300 text-sm ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-cyber-dark text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[300px]">
          <AnimatePresence>
            {displayedSkills.map((skill, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: (index % 15) * 0.05 }} // stagger animation
                key={skill.name + index}
                className="group relative rounded-2xl border border-white/10 bg-[#0f172a] p-6 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] flex flex-col items-center justify-center gap-4"
              >
                <div className="text-4xl mb-2 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {skillIcons[skill.name] || <FaCode />}
                </div>
                <h3 className="text-sm font-semibold text-slate-300 group-hover:text-blue-400 transition-colors text-center">
                  {skill.name}
                </h3>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
