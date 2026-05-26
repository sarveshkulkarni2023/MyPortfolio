import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { githubService } from '../../services/dataService';

export default function GitHubSection() {
  const [stats, setStats] = useState({ repos: 0, stars: 0, contributions: 0, pinnedRepos: [] });

  useEffect(() => {
    githubService.getStats().then(({ data }) => setStats(data)).catch(() => {
      setStats({ repos: 42, stars: 156, contributions: 1247, pinnedRepos: [
        { name: 'neural-threat-detector', description: 'LSTM-based IDS', language: 'Python', stars: 45, forks: 12 },
        { name: 'crypto-vault', description: 'E2E encrypted storage', language: 'Rust', stars: 32, forks: 8 },
        { name: 'zero-day-scanner', description: 'Automated vuln scanner', language: 'Go', stars: 28, forks: 6 },
      ]});
    });
  }, []);

  return (
    <section id="github" className="py-24 relative">
      <div className="section-container">
        <SectionHeading tag="Open Source" title="GitHub Activity" subtitle="Contributions and open source engineering." />
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          {[{ label: 'Repositories', value: stats.repos }, { label: 'Stars', value: stats.stars }, { label: 'Contributions', value: stats.contributions }].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 text-center">
              <div className="text-2xl font-display font-bold text-neon-blue">{s.value}</div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.pinnedRepos?.map((repo, i) => (
            <motion.div key={repo.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FaGithub className="text-white/30" size={14} />
                  <span className="text-sm font-mono text-neon-blue">{repo.name}</span>
                </div>
                <p className="text-xs text-white/30 font-mono mb-3">{repo.description}</p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-blue" />{repo.language}</span>
                  <span className="flex items-center gap-1"><FaStar size={10} />{repo.stars}</span>
                  <span className="flex items-center gap-1"><FaCodeBranch size={10} />{repo.forks}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
