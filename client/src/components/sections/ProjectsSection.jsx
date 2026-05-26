import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { projectsService, analyticsService } from '../../services/dataService';

const categories = ['All', 'AI/ML', 'Cybersecurity', 'Full Stack', 'DevOps', 'Open Source'];

const demoProjects = [
  { id: 1, title: 'Neural Threat Detector', category: 'AI/ML', description: 'Deep learning IDS using LSTM autoencoders for anomaly detection.', techStack: ['Python', 'TensorFlow', 'Kafka', 'Docker'], liveUrl: '#', repoUrl: '#' },
  { id: 2, title: 'CryptoVault', category: 'Cybersecurity', description: 'E2E encrypted file storage with zero-knowledge auth and AES-256.', techStack: ['Rust', 'React', 'WebCrypto', 'PostgreSQL'], liveUrl: '#', repoUrl: '#' },
  { id: 3, title: 'OpsCommand', category: 'Full Stack', description: 'Real-time infra monitoring with automated incident response.', techStack: ['Next.js', 'Go', 'Grafana', 'K8s'], liveUrl: '#', repoUrl: '#' },
  { id: 4, title: 'Adversarial ML Framework', category: 'AI/ML', description: 'Model robustness testing against adversarial attacks.', techStack: ['PyTorch', 'FastAPI', 'Redis', 'Docker'], repoUrl: '#' },
  { id: 5, title: 'ZeroDay Scanner', category: 'Cybersecurity', description: 'Automated vulnerability scanner with CVE correlation.', techStack: ['Go', 'Python', 'Nmap', 'MongoDB'], repoUrl: '#' },
  { id: 6, title: 'CloudSentinel', category: 'DevOps', description: 'Cloud security posture management with compliance monitoring.', techStack: ['AWS', 'Terraform', 'React', 'Node.js'], liveUrl: '#', repoUrl: '#' },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState(demoProjects);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    projectsService.getAll()
      .then(({ data }) => { if (data.projects?.length) setProjects(data.projects); })
      .catch(() => {});
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);
  const displayProjects = filtered.slice(0, 6);

  const getTechStack = (stack) => {
    try {
      return Array.isArray(stack) ? stack : JSON.parse(stack || '[]');
    } catch {
      return typeof stack === 'string' ? [stack] : [];
    }
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="section-container">
        <SectionHeading tag="Mission Log" title="Project Systems" subtitle="Deployed solutions across AI, cybersecurity, and full-stack domains." />
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition-all duration-300 ${filter === cat ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' : 'text-white/30 border-white/5 hover:text-white/60'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, i) => (
            <motion.div key={project.id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="h-full flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-t-xl bg-cyber-mid flex items-center justify-center">
                  {project.thumbnail ? <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-16 h-16 border border-neon-blue/20 rounded-xl flex items-center justify-center"><span className="text-2xl text-neon-blue/30 font-display">{project.title?.[0]}</span></div>}
                  <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-mono uppercase bg-cyber-black/80 text-neon-blue border border-neon-blue/20 rounded">{project.category}</span>
                </div>
                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-lg font-display font-semibold text-white/90 mb-2">{project.title}</h3>
                  <p className="text-sm text-white/30 font-mono leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {getTechStack(project.techStack).slice(0, 4).map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-mono text-white/40 bg-white/5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-neon-blue hover:text-neon-cyan transition-colors" onClick={() => analyticsService.track('PROJECT_VIEW', { project: project.title })}><FaExternalLinkAlt size={10} /> Live</a>}
                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-white transition-colors"><FaGithub size={12} /> Source</a>}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
