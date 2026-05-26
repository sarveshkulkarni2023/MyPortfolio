import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import CyberCursor from '../ui/CyberCursor';
import useUIStore from '../../store/uiStore';

export default function Layout() {
  const location = useLocation();
  const { setLoading } = useUIStore();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-cyber-black text-white relative">
      <CyberCursor />
      {/* Animated grid background */}
      <div className="fixed inset-0 cyber-grid-bg pointer-events-none opacity-40" />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-neon-blue/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
