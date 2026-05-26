import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle, tag, align = 'center' }) {
  const alignment = {
    center: 'text-center items-center',
    left: 'text-left items-start',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-4 mb-16 ${alignment[align]}`}
    >
      {tag && (
        <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-neon-blue bg-neon-blue/5 border border-neon-blue/10 rounded-full">
          {tag}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-slate-400 text-sm md:text-base font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="flex items-center gap-3 mt-4 opacity-50">
        <div className="w-16 h-[2px] bg-gradient-to-r from-neon-blue to-neon-purple rounded-full" />
      </div>
    </motion.div>
  );
}
