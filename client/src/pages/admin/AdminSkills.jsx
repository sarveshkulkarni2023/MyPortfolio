import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/ui/Modal';
import { skillsService } from '../../services/dataService';
import { HiPlus, HiPencil, HiTrash, HiFolderAdd } from 'react-icons/hi';

export default function AdminSkills() {
  const [categories, setCategories] = useState([]);
  
  // Modals state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  
  // Edit state
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  
  // Forms state
  const [skillForm, setSkillForm] = useState({ name: '', icon: '', proficiency: 50, categoryId: '' });
  const [catForm, setCatForm] = useState({ name: '', icon: '' });
  
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = () => {
    skillsService.getAll()
      .then(({ data }) => setCategories(data.skills || []))
      .catch(() => {});
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { 
        ...skillForm, 
        proficiency: parseInt(skillForm.proficiency),
        categoryId: parseInt(skillForm.categoryId)
      };
      
      if (editingSkill) {
        await skillsService.update(editingSkill.id, payload);
      } else {
        await skillsService.create(payload);
      }
      setShowSkillModal(false);
      setEditingSkill(null);
      load();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editingCat) {
        await skillsService.updateCategory(editingCat.id, catForm);
      } else {
        await skillsService.createCategory(catForm);
      }
      setShowCatModal(false);
      setEditingCat(null);
      load();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const openEditSkill = (skill) => { 
    setEditingSkill(skill); 
    setError(''); 
    setSkillForm({ name: skill.name, icon: skill.icon || '', proficiency: skill.proficiency, categoryId: skill.categoryId }); 
    setShowSkillModal(true); 
  };
  const openNewSkill = () => { 
    setEditingSkill(null); 
    setError(''); 
    setSkillForm({ name: '', icon: '', proficiency: 50, categoryId: categories[0]?.id || '' }); 
    setShowSkillModal(true); 
  };
  
  const openEditCat = (cat) => { 
    setEditingCat(cat); 
    setError(''); 
    setCatForm({ name: cat.category, icon: cat.icon || '' }); 
    setShowCatModal(true); 
  };
  const openNewCat = () => { 
    setEditingCat(null); 
    setError(''); 
    setCatForm({ name: '', icon: '' }); 
    setShowCatModal(true); 
  };

  const handleDeleteSkill = async (id) => { 
    if (confirm('Delete this skill?')) { await skillsService.delete(id); load(); } 
  };
  const handleDeleteCat = async (id) => { 
    if (confirm('Delete this category and ALL its skills?')) { await skillsService.deleteCategory(id); load(); } 
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-white/80">Skills & Categories</h2>
        <div className="flex gap-3">
          <Button onClick={openNewCat} size="sm" variant="secondary" icon={<HiFolderAdd />}>Add Category</Button>
          <Button onClick={openNewSkill} size="sm" icon={<HiPlus />}>Add Skill</Button>
        </div>
      </div>

      <div className="grid gap-8">
        {categories.map((cat) => (
          <div key={cat.id || cat.category} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-md font-display font-semibold text-neon-blue">{cat.category}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditCat(cat)}><HiPencil /></Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteCat(cat.id)}><HiTrash /></Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cat.skills?.map((skill) => (
                <GlassCard key={skill.id} hover={false} className="p-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-display text-white/80">{skill.name}</h4>
                    <p className="text-xs font-mono text-white/40">{skill.proficiency}%</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEditSkill(skill)}><HiPencil /></Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteSkill(skill.id)}><HiTrash /></Button>
                  </div>
                </GlassCard>
              ))}
              {(!cat.skills || cat.skills.length === 0) && (
                <p className="text-xs font-mono text-white/30 col-span-2">No skills in this category.</p>
              )}
            </div>
          </div>
        ))}
        {!categories.length && (
          <p className="text-sm font-mono text-white/20 text-center py-12">No categories or skills yet.</p>
        )}
      </div>

      {/* Skill Modal */}
      <Modal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} title={editingSkill ? 'Edit Skill' : 'New Skill'}>
        <form onSubmit={handleSaveSkill} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <Input label="Name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40">Category</label>
            <select 
              value={skillForm.categoryId} 
              onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
              className="w-full bg-cyber-dark/80 text-white border border-white/10 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-blue/40"
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.category}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Proficiency (0-100)" type="number" min="0" max="100" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} required />
            <Input label="Icon Name (Optional)" value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} />
          </div>

          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Skill</Button>
        </form>
      </Modal>

      {/* Category Modal */}
      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title={editingCat ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSaveCategory} className="space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
          
          <Input label="Category Name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
          <Input label="Icon Name (Optional)" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />

          <Button type="submit" variant="neon" className="w-full" loading={saving}>Save Category</Button>
        </form>
      </Modal>
    </div>
  );
}
