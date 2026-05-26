import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`
        relative overflow-hidden rounded-xl
        bg-cyber-mid/30 backdrop-blur-md
        border border-white/5
        ${glow ? 'shadow-lg shadow-neon-blue/10' : 'shadow-md shadow-black/10'}
        ${hover ? 'transition-all duration-300 hover:border-neon-blue/40 hover:bg-cyber-mid/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group' : ''}
        ${className}
      `}
      {...props}
    >
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${hover ? 'group-hover:via-neon-blue/50 transition-colors duration-300' : ''}`} />
      {children}
    </motion.div>
  );
}
