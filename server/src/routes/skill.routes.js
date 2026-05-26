import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { 
  validate, 
  skillSchema, 
  skillUpdateSchema, 
  skillCategorySchema, 
  skillCategoryUpdateSchema 
} from '../validators/schemas.js';

const router = Router();

// GET /api/skills — public, grouped by category
router.get('/', async (req, res, next) => {
  try {
    const categories = await req.prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { id: 'asc' },
    });
    const skills = categories.map((c) => ({ id: c.id, category: c.name, icon: c.icon, skills: c.skills }));
    res.json({ skills });
  } catch (err) { next(err); }
});

// POST /api/admin/skills
router.post('/', authMiddleware, adminOnly, validate(skillSchema), async (req, res, next) => {
  try { const skill = await req.prisma.skill.create({ data: req.body }); res.status(201).json({ skill }); }
  catch (err) { next(err); }
});

// PUT /api/admin/skills/:id
router.put('/:id', authMiddleware, adminOnly, validate(skillUpdateSchema), async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;
    const skill = await req.prisma.skill.update({ 
      where: { id: parseInt(req.params.id) }, 
      data: updateData 
    }); 
    res.json({ skill }); 
  } catch (err) { next(err); }
});

// DELETE /api/admin/skills/:id
router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try { await req.prisma.skill.delete({ where: { id: parseInt(req.params.id) } }); res.json({ success: true }); }
  catch (err) { next(err); }
});

// Skill categories CRUD
router.post('/categories', authMiddleware, adminOnly, validate(skillCategorySchema), async (req, res, next) => {
  try { const cat = await req.prisma.skillCategory.create({ data: req.body }); res.status(201).json({ category: cat }); }
  catch (err) { next(err); }
});

router.put('/categories/:id', authMiddleware, adminOnly, validate(skillCategoryUpdateSchema), async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;
    const cat = await req.prisma.skillCategory.update({ 
      where: { id: parseInt(req.params.id) }, 
      data: updateData 
    }); 
    res.json({ category: cat }); 
  } catch (err) { next(err); }
});

router.delete('/categories/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try { await req.prisma.skillCategory.delete({ where: { id: parseInt(req.params.id) } }); res.json({ success: true }); }
  catch (err) { next(err); }
});

export default router;
