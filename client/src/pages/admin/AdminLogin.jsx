import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import useAuthStore from '../../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-black p-4">
      <div className="fixed inset-0 cyber-grid-bg opacity-20 pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="glass-panel-strong p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 mb-4">
              <span className="text-neon-blue font-display font-bold text-lg">CC</span>
            </div>
            <h1 className="text-xl font-display font-semibold text-white/90">Admin Access</h1>
            <p className="text-xs font-mono text-white/30 mt-1">Authenticate to access command center</p>
          </div>
          {error && <div className="mb-4 px-4 py-2 text-xs font-mono text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" variant="neon" size="lg" className="w-full" loading={isLoading}>Authenticate</Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
