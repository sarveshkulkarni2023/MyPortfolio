import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineHome, HiOutlineCollection, HiOutlineLightningBolt,
  HiOutlineDocumentText, HiOutlineBadgeCheck, HiOutlineBriefcase,
  HiOutlineMail, HiOutlineChartBar, HiOutlineLogout, HiOutlineMenu, HiOutlineX
} from 'react-icons/hi';
import useAuthStore from '../../store/authStore';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: HiOutlineHome },
  { label: 'Projects', path: '/admin/projects', icon: HiOutlineCollection },
  { label: 'Skills', path: '/admin/skills', icon: HiOutlineLightningBolt },
  { label: 'Resumes', path: '/admin/resumes', icon: HiOutlineDocumentText },
  { label: 'Certifications', path: '/admin/certifications', icon: HiOutlineBadgeCheck },
  { label: 'Experience', path: '/admin/experience', icon: HiOutlineBriefcase },
  { label: 'Messages', path: '/admin/messages', icon: HiOutlineMail },
  { label: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cyber-black flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-cyber-darker border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/admin" className="font-display text-sm font-semibold tracking-wider uppercase">
            <span className="text-neon-blue">Admin</span>
            <span className="text-white/60 ml-1">Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-white/40">
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-xs font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-white/60 truncate">{user?.name || 'Admin'}</div>
              <div className="text-[10px] font-mono text-white/30 truncate">{user?.email || ''}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <HiOutlineLogout size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 flex items-center px-6 border-b border-white/5 bg-cyber-black/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white/40 hover:text-white mr-4"
          >
            <HiOutlineMenu size={20} />
          </button>
          <h1 className="text-sm font-display font-semibold text-white/60 uppercase tracking-wider">
            {sidebarLinks.find((l) => l.path === location.pathname)?.label || 'Admin'}
          </h1>
          <Link
            to="/"
            className="ml-auto text-xs font-mono text-white/30 hover:text-neon-blue transition-colors"
          >
            ← View Site
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
