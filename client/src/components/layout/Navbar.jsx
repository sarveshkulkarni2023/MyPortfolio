import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import useUIStore from '../../store/uiStore';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const handleNavClick = (href) => {
    closeMobileMenu();
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cyber-dark/90 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 group"
            >
              <span className="font-display font-bold text-2xl text-neon-blue">S</span>
              <span className="hidden sm:block font-display text-xl font-bold tracking-wider text-white group-hover:text-neon-blue transition-colors">
                arvesh Kulkarni.
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm font-sans font-medium text-white/70 hover:text-neon-blue transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300 rounded-full" />
                  </button>
                ))}
              </div>
              
              {/* Resume CTA */}
              <button
                onClick={() => useUIStore.getState().openResumeModal()}
                className="px-5 py-2 text-sm font-sans font-semibold text-neon-blue border-2 border-neon-blue/50 rounded-md hover:bg-neon-blue/10 hover:border-neon-blue transition-all duration-300"
              >
                Resume
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white/80 hover:text-neon-blue transition-colors"
            >
              {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobileMenu} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-cyber-dark border-l border-white/5 p-8 flex flex-col gap-6">
              <button onClick={closeMobileMenu} className="self-end text-white/40 hover:text-white">
                <HiX size={24} />
              </button>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-lg font-mono text-white/60 hover:text-neon-blue transition-colors"
                >
                  <span className="text-neon-blue/40 mr-2 text-sm">0{i + 1}.</span>
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={() => {
                  closeMobileMenu();
                  useUIStore.getState().openResumeModal();
                }}
                className="mt-4 px-4 py-3 text-sm font-mono uppercase tracking-wider text-neon-blue border border-neon-blue/30 rounded-lg hover:bg-neon-blue/10 transition-all text-center"
              >
                Career Profiles
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
