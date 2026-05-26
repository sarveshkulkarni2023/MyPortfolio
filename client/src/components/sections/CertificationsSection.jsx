import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import GlassCard from '../ui/GlassCard';
import { certsService } from '../../services/dataService';

const demoCerts = [
  { id: 1, title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', issueDate: '2024-03', url: '#' },
  { id: 2, title: 'CompTIA Security+', issuer: 'CompTIA', issueDate: '2023-11', url: '#' },
  { id: 3, title: 'TensorFlow Developer Certificate', issuer: 'Google', issueDate: '2024-01', url: '#' },
];

export default function CertificationsSection() {
  const [certs, setCerts] = useState(demoCerts);
  useEffect(() => { certsService.getAll().then(({ data }) => { if (data.certifications?.length) setCerts(data.certifications); }).catch(() => {}); }, []);

  return (
    <section id="certifications" className="py-24 relative">
      <div className="section-container">
        <SectionHeading tag="Credentials" title="Certifications" subtitle="Verified professional certifications and qualifications." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5">
                <div className="w-10 h-10 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4">
                  <span className="text-neon-blue text-lg">🏆</span>
                </div>
                <h3 className="text-sm font-display font-semibold text-white/90 mb-1">{cert.title}</h3>
                <p className="text-xs font-mono text-white/40 mb-2">{cert.issuer}</p>
                <p className="text-[10px] font-mono text-neon-blue/50">{new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                {cert.url ? (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-mono text-neon-blue hover:text-neon-cyan transition-colors">Verify →</a>
                ) : cert.image ? (
                  <a href={cert.image} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-mono text-neon-blue hover:text-neon-cyan transition-colors">View Certificate →</a>
                ) : null}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
