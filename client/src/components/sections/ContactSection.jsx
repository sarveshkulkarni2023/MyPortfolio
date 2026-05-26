import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import SectionHeading from '../ui/SectionHeading';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { contactService } from '../../services/dataService';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await contactService.send(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="section-container">
        <SectionHeading tag="Transmission" title="Establish Contact" subtitle="Send a secure transmission. I'll respond within 24 hours." />
        <div className="max-w-xl mx-auto">
          <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit} className="glass-panel p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <Input label="Subject" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="Your message..."
                className="w-full bg-cyber-dark/80 text-white placeholder-white/20 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40 focus:ring-1 focus:ring-neon-blue/20 transition-all duration-300 resize-none" />
            </div>
            <Button type="submit" variant="neon" size="lg" className="w-full" loading={loading} icon={<FaPaperPlane />}>
              Send Transmission
            </Button>
            {status === 'success' && <p className="text-sm font-mono text-neon-green text-center">✓ Message transmitted successfully.</p>}
            {status === 'error' && <p className="text-sm font-mono text-red-400 text-center">✗ Transmission failed. Try again.</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
