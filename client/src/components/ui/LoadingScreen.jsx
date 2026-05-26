import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cyber-black">
      <div className="relative flex flex-col items-center gap-6">
        {/* Hexagonal spinner */}
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 border-2 border-neon-blue/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 border-2 border-neon-purple/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex items-center gap-2 font-mono text-sm text-neon-blue/70">
          <span>INITIALIZING</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ···
          </motion.span>
        </div>

        {/* Scan line */}
        <div className="absolute -inset-10 overflow-hidden pointer-events-none">
          <motion.div
            className="w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent"
            animate={{ y: [-40, 120] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
