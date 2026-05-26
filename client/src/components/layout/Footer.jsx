import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-cyber-black/50">
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display text-sm font-semibold tracking-wider uppercase">
              Command<span className="text-neon-blue">Center</span>
            </span>
            <span className="text-xs font-mono text-white/30">
              AI + Cybersecurity Engineering
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {[
              { icon: <FaGithub />, href: '#', label: 'GitHub' },
              { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/sarvesh-kulkarni-723404294/', label: 'LinkedIn' },
              { icon: <FaEnvelope />, href: '#contact', label: 'Email' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-white/30 hover:text-neon-blue hover:bg-neon-blue/5 border border-white/5 hover:border-neon-blue/20 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <Link to="/seo-guide" className="text-xs font-mono text-white/40 hover:text-neon-blue transition-colors flex items-center gap-1.5 mb-1 group">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue/80 group-hover:animate-ping" />
              SEO Guide (2026)
            </Link>
            <span className="text-xs font-mono text-white/20">
              © {currentYear} All rights reserved
            </span>
            <span className="text-[10px] font-mono text-white/10">
              v1.0.0 // SYSTEM ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent" />
    </footer>
  );
}
