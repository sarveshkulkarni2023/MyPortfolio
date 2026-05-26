import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaBrain, FaShieldAlt, FaCode } from 'react-icons/fa';
import Modal from '../ui/Modal';
import { resumesService, analyticsService } from '../../services/dataService';

const icons = { 'AI/ML': FaBrain, 'Cybersecurity': FaShieldAlt, 'Full Stack': FaCode };
const demoResumes = [
  { id: 1, title: 'AI/ML Engineer', category: 'AI/ML', driveUrl: '#' },
  { id: 2, title: 'Cybersecurity Analyst', category: 'Cybersecurity', driveUrl: '#' },
  { id: 3, title: 'Full Stack Developer', category: 'Full Stack', driveUrl: '#' },
];

export default function ResumeModal({ isOpen, onClose }) {
  const [resumes, setResumes] = useState(demoResumes);

  useEffect(() => {
    if (isOpen) {
      resumesService.getAll().then(({ data }) => { if (data.resumes?.length) setResumes(data.resumes); }).catch(() => {});
    }
  }, [isOpen]);

  const handleDownload = (resume) => {
    analyticsService.track('RESUME_DOWNLOAD', { category: resume.category });
    window.open(resume.driveUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access Career Profiles" size="lg">
      <p className="text-sm font-mono text-white/30 mb-8">Select a career profile to download the corresponding resume.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resumes.map((resume, i) => {
          const Icon = icons[resume.category] || FaCode;
          return (
            <motion.button key={resume.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => handleDownload(resume)}
              className="flex flex-col items-center gap-4 p-6 rounded-xl border border-white/5 bg-glass-light hover:border-neon-blue/30 hover:bg-neon-blue/5 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center group-hover:shadow-neon transition-all">
                <Icon className="text-neon-blue text-xl" />
              </div>
              <div className="text-center">
                <div className="text-sm font-display font-semibold text-white/80 group-hover:text-neon-blue transition-colors">{resume.title}</div>
                <div className="text-[10px] font-mono text-white/30 mt-1">{resume.category}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/30 group-hover:text-neon-blue transition-colors">
                <FaDownload size={10} /> Download
              </div>
            </motion.button>
          );
        })}
      </div>
    </Modal>
  );
}
