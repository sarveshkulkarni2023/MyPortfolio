import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl font-display font-bold gradient-text mb-4">404</div>
        <p className="text-white/40 font-mono mb-2">SYSTEM :: PAGE_NOT_FOUND</p>
        <p className="text-sm text-white/20 font-mono mb-8">The requested resource does not exist in this sector.</p>
        <Link to="/" className="px-6 py-3 font-mono text-sm text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/10 transition-all">Return to Base</Link>
      </motion.div>
    </div>
  );
}
