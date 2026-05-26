import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { resumesService } from '../../services/dataService';
import { HiPlus, HiPencil, HiTrash, HiDownload, HiExternalLink } from 'react-icons/hi';

export default function AdminResumes() {
  const [resumes, setResumes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', driveUrl: '', active: true });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    resumesService.getAll()
      .then(({ data }) => setResumes(data.resumes || []))
      .catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing) {
        await resumesService.update(editing.id, form);
      } else {
        await resumesService.create(form);
      }
      setShowModal(false);
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (res) => { 
    setEditing(res); 
    setError(''); 
    setForm({ 
      title: res.title,
      category: res.category,
      driveUrl: res.driveUrl,
      active: res.active
    }); 
    setShowModal(true); 
  };

  const openNew = () => { 
    setEditing(null); 
    setError(''); 
    setForm({ title: '', category: '', driveUrl: '', active: true }); 
    setShowModal(true); 
  };

  const handleDelete = async (id) => { 
    if (confirm('Delete this resume?')) { 
      await resumesService.delete(id); 
      load(); 
    } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Resumes</h2>
        <Button onClick={openNew} size="sm" icon={<HiPlus />}>Add Resume</Button>
      </div>

      <div className="grid gap-4">
        {resumes.map((res) => (
          <GlassCard key={res.id} hover={false} className={`p-4 flex items-center justify-between ${!res.active ? 'opacity-50' : ''}`}>
            <div>
              <h3 className="text-sm font-display font-semibold text-white/80 flex items-center gap-2">
                {res.title}
                {!res.active && <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-red-500/20 text-red-400">INACTIVE</span>}
              </h3>
              <p className="text-xs font-mono text-white/30">
                {res.category}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1 text-xs font-mono text-white/40">
                <HiDownload /> {res.downloads}
              </div>
              <div className="flex gap-2">
                <a href={res.driveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  <HiExternalLink />
                </a>
                <Button size="sm" variant="ghost" onClick={() => openEdit(res)}><HiPencil /></Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(res.id)}><HiTrash /></Button>
              </div>
            </div>
          </GlassCard>
        ))}
        {!resumes.length && (
          <p className="text-sm font-mono text-white/20 text-center py-12">No resumes yet. Add one to get started.</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Resume' : 'New Resume'}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required placeholder="e.g. Software Engineer" />
          </div>
          
          <Input label="Google Drive Share URL" type="url" value={form.driveUrl} onChange={(e) => setForm({ ...form, driveUrl: e.target.value })} required />
          
          <div className="flex items-center gap-2 text-sm font-mono text-white/50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.active} 
              onChange={(e) => setForm({ ...form, active: e.target.checked })} 
              className="rounded" 
            /> 
            <label>Active (Visible on Site)</label>
          </div>

          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Resume</Button>
        </form>
      </Modal>
    </div>
  );
}
