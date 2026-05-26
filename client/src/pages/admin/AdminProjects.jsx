import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { projectsService, uploadService } from '../../services/dataService';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', description: '', category: '', techStack: '', liveUrl: '', repoUrl: '', status: 'DRAFT', featured: false });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = () => projectsService.getAll().then(({ data }) => setProjects(data.projects || [])).catch(() => {});

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, techStack: JSON.stringify(form.techStack.split(',').map(s => s.trim()).filter(Boolean)) };
      if (editing) await projectsService.update(editing.id, payload); else await projectsService.create(payload);
      setShowModal(false); setEditing(null); load();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p) => { setEditing(p); setError(''); setForm({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : JSON.parse(p.techStack || '[]').join(', ') }); setShowModal(true); };
  const openNew = () => { setEditing(null); setError(''); setForm({ title: '', slug: '', description: '', category: '', techStack: '', liveUrl: '', repoUrl: '', status: 'DRAFT', featured: false }); setShowModal(true); };
  const handleDelete = async (id) => { if (confirm('Delete this project?')) { await projectsService.delete(id); load(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Projects</h2>
        <Button onClick={openNew} size="sm" icon={<HiPlus />}>Add Project</Button>
      </div>
      <div className="grid gap-4">
        {projects.map((p) => (
          <GlassCard key={p.id} hover={false} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-semibold text-white/80">{p.title}</h3>
              <p className="text-xs font-mono text-white/30">{p.category} • {p.status}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><HiPencil /></Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}><HiTrash /></Button>
            </div>
          </GlassCard>
        ))}
        {!projects.length && <p className="text-sm font-mono text-white/20 text-center py-12">No projects yet. Add one to get started.</p>}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Project' : 'New Project'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-cyber-dark/80 text-white border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40"
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Full Stack">Full Stack</option>
                <option value="DevOps">DevOps</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
            <Input label="Tech Stack (comma-separated)" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
            <Input label="Repo URL" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-cyber-dark text-white text-sm font-mono border border-white/10 rounded-lg px-3 py-2">
              <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-mono text-white/50 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" /> Featured
            </label>
          </div>
          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Project</Button>
        </form>
      </Modal>
    </div>
  );
}
