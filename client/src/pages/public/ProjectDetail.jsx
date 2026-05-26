import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import DOMPurify from 'dompurify';
import { projectsService, analyticsService } from '../../services/dataService';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsService.getBySlug(slug)
      .then(({ data }) => { setProject(data.project); analyticsService.track('PROJECT_VIEW', { slug }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div>;
  if (!project) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="font-mono text-white/40">Project not found</p><Link to="/" className="text-neon-blue font-mono text-sm">← Back</Link></div>;

  return (
    <>
      <Helmet><title>{project.title} | Command Center</title></Helmet>
      <div className="min-h-screen pt-24 pb-16">
        <div className="section-container">
          <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-mono text-white/40 hover:text-neon-blue transition-colors mb-8"><FaArrowLeft size={12} /> Back to Projects</Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">{project.title}</h1>
            <p className="text-white/40 font-mono max-w-2xl mb-8">{project.description}</p>
            <div className="flex gap-4 mb-12">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/20 transition-all"><FaExternalLinkAlt size={12} /> Live Demo</a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-white/60 border border-white/10 rounded-lg hover:bg-white/5 transition-all"><FaGithub size={14} /> Source</a>}
            </div>
            {project.longDesc && (
              <div 
                className="prose prose-invert max-w-3xl font-mono text-sm leading-relaxed text-white/40" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.longDesc) }} 
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
