import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { certsService } from '../../services/dataService';
import { HiPlus, HiPencil, HiTrash, HiExternalLink } from 'react-icons/hi';

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '', image: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  
  const load = () => {
    certsService.getAll()
      .then(({ data }) => setCertifications(data.certifications || []))
      .catch(() => {});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.expiryDate) delete payload.expiryDate;
      
      if (editing) {
        await certsService.update(editing.id, payload);
      } else {
        await certsService.create(payload);
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

  const openEdit = (cert) => { 
    setEditing(cert); 
    setError(''); 
    setForm({ 
      ...cert, 
      issueDate: cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '',
      expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
      credentialId: cert.credentialId || '',
      url: cert.url || '',
      image: cert.image || ''
    }); 
    setShowModal(true); 
  };
  
  const openNew = () => { 
    setEditing(null); 
    setError(''); 
    setForm({ title: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '', image: '' }); 
    setShowModal(true); 
  };
  
  const handleDelete = async (id) => { 
    if (confirm('Delete this certification?')) { 
      await certsService.delete(id); 
      load(); 
    } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Certifications</h2>
        <Button onClick={openNew} size="sm" icon={<HiPlus />}>Add Certification</Button>
      </div>

      <div className="grid gap-4">
        {certifications.map((cert) => (
          <GlassCard key={cert.id} hover={false} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-display font-semibold text-white/80">{cert.title}</h3>
              <p className="text-xs font-mono text-white/30">
                {cert.issuer} • {new Date(cert.issueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {(cert.url || cert.image) && (
                <a href={cert.url || cert.image} target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                  <HiExternalLink />
                </a>
              )}
              <Button size="sm" variant="ghost" onClick={() => openEdit(cert)}><HiPencil /></Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(cert.id)}><HiTrash /></Button>
            </div>
          </GlassCard>
        ))}
        {!certifications.length && (
          <p className="text-sm font-mono text-white/20 text-center py-12">No certifications yet. Add one to get started.</p>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Certification' : 'New Certification'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date" type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
            <Input label="Expiry Date (Optional)" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Credential ID (Optional)" value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} />
            <Input label="URL (Optional)" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </div>
          
          <Input label="Image URL (Optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Certification</Button>
        </form>
      </Modal>
    </div>
  );
}
