import { forwardRef, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const Button = forwardRef(
  ({ children, variant = 'primary', size = 'md', icon, className = '', disabled, loading, ...props }, ref) => {
    const base =
      'relative inline-flex items-center justify-center font-sans font-semibold transition-colors duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-neon-blue/10';

    const variants = {
      primary:
        'bg-neon-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]',
      secondary:
        'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 hover:border-neon-blue/40',
      ghost:
        'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 hover:text-neon-blue',
      danger:
        'bg-red-500/10 text-red-400 hover:bg-red-500/20',
      neon:
        'bg-white text-cyber-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-8 py-3.5 text-base gap-2.5',
    };

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const localRef = useRef(null);

    const handleMouseMove = (e) => {
      if (disabled || loading || !localRef.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = localRef.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.button
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.1 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          <span className="text-lg">{icon}</span>
        ) : null}
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
