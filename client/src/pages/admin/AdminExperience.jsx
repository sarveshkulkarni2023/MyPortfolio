import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { experienceService } from '../../services/dataService';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function AdminExperience() {
  const [experience, setExperience] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', company: '', type: 'WORK', description: '', startDate: '', endDate: '', current: false, techStack: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    experienceService.getAll()
      .then(({ data }) => setExperience(data.experience || []))
      .catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.endDate) delete payload.endDate;
      if (!payload.techStack) delete payload.techStack;

      if (editing) {
        await experienceService.update(editing.id, payload);
      } else {
        await experienceService.create(payload);
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

  const openEdit = (exp) => { 
    setEditing(exp); 
    setError(''); 
    setForm({ 
      ...exp, 
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      current: exp.current || false,
      techStack: exp.techStack || ''
    }); 
    setShowModal(true); 
  };

  const openNew = () => { 
    setEditing(null); 
    setError(''); 
    setForm({ title: '', company: '', type: 'WORK', description: '', startDate: '', endDate: '', current: false, techStack: '' }); 
    setShowModal(true); 
  };

  const handleDelete = async (id) => { 
    if (confirm('Delete this experience?')) { 
      await experienceService.delete(id); 
      load(); 
    } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Experience</h2>
        <Button onClick={openNew} size="sm" icon={<HiPlus />}>Add Experience</Button>
      </div>

      <div className="grid gap-4">
        {experience.map((exp) => (
          <GlassCard key={exp.id} hover={false} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-semibold text-white/80">{exp.title} <span className="text-white/40">at</span> {exp.company}</h3>
              <p className="text-xs font-mono text-white/30">
                {exp.type} • {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => openEdit(exp)}><HiPencil /></Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(exp.id)}><HiTrash /></Button>
            </div>
          </GlassCard>
        ))}
        {!experience.length && (
          <p className="text-sm font-mono text-white/20 text-center py-12">No experience entries yet. Add one to get started.</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Experience' : 'New Experience'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Company/Organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-cyber-dark/80 text-white border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40"
              >
                <option value="WORK">Work</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="ACHIEVEMENT">Achievement</option>
              </select>
            </div>
            <Input label="Tech Stack (Optional)" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            <Input 
              label="End Date" 
              type="date" 
              value={form.endDate} 
              onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
              disabled={form.current}
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-mono text-white/50 cursor-pointer">
            <input 
              type="checkbox" 
              checked={form.current} 
              onChange={(e) => {
                setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate });
              }} 
              className="rounded" 
            /> 
            <label>Currently Working Here</label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40">Description</label>
            <textarea
              className="w-full bg-cyber-dark/80 text-white border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40 min-h-[100px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Experience</Button>
        </form>
      </Modal>
    </div>
  );
}
