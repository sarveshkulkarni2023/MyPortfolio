import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-cyber-dark/80 text-white placeholder-white/20
            border border-white/10 rounded-lg
            px-4 py-3 text-sm font-mono
            focus:outline-none focus:border-neon-blue/40 focus:ring-1 focus:ring-neon-blue/20
            transition-all duration-300
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500/70' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-mono text-red-400">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
