import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { experienceService } from '../../services/dataService';

const demoExperiences = [
  { id: 1, title: 'AI Security Researcher', company: 'CyberLab Inc.', type: 'WORK', startDate: '2024-06', endDate: null, current: true, description: 'Leading adversarial ML research and developing AI-powered threat detection systems.', techStack: ['Python', 'TensorFlow', 'AWS'] },
  { id: 2, title: 'Security Engineering Intern', company: 'DefenseNet', type: 'INTERNSHIP', startDate: '2024-01', endDate: '2024-05', description: 'Performed penetration testing and vulnerability assessments across enterprise infrastructure.', techStack: ['Burp Suite', 'Nmap', 'Metasploit'] },
  { id: 3, title: 'Best AI Security Solution', company: 'HackDefend 2024', type: 'HACKATHON', startDate: '2023-11', endDate: '2023-11', description: 'Built an AI-powered WAF prototype that won 1st place among 200+ teams.', techStack: ['Python', 'React', 'Docker'] },
];

const typeColors = { WORK: 'neon-blue', INTERNSHIP: 'neon-purple', HACKATHON: 'neon-green', ACHIEVEMENT: 'neon-pink' };

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState(demoExperiences);

  useEffect(() => {
    experienceService.getAll().then(({ data }) => { if (data.experiences?.length) setExperiences(data.experiences); }).catch(() => {});
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';

  return (
    <section id="experience" className="py-24 relative">
      <div className="section-container">
        <SectionHeading tag="Mission History" title="Experience Timeline" subtitle="Professional journey across AI and cybersecurity domains." />
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/30 via-neon-purple/20 to-transparent" />
          {experiences.map((exp, i) => (
            <motion.div key={exp.id || i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-cyber-black border-2 border-neon-blue z-10 mt-6" />
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] glass-panel p-5 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-${typeColors[exp.type] || 'neon-blue'}/10 text-${typeColors[exp.type] || 'neon-blue'} border border-${typeColors[exp.type] || 'neon-blue'}/20 mb-2`}>
                  {exp.type}
                </span>
                <h3 className="text-base font-display font-semibold text-white/90">{exp.title}</h3>
                <p className="text-xs font-mono text-neon-blue/60 mb-2">{exp.company} • {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                <p className="text-sm text-white/30 font-mono leading-relaxed mb-3">{exp.description}</p>
                {exp.techStack && (
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(exp.techStack) ? exp.techStack : JSON.parse(exp.techStack || '[]')).map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-mono text-white/40 bg-white/5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
