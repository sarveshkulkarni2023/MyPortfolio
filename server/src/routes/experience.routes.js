import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validate, experienceSchema, experienceUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { const experiences = await req.prisma.experience.findMany({ orderBy: { startDate: 'desc' } }); res.json({ experiences }); }
  catch (err) { next(err); }
});

router.post('/', authMiddleware, adminOnly, validate(experienceSchema), async (req, res, next) => {
  try {
    const data = { ...req.body, startDate: new Date(req.body.startDate), endDate: req.body.endDate ? new Date(req.body.endDate) : null };
    const exp = await req.prisma.experience.create({ data });
    res.status(201).json({ experience: exp });
  } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, adminOnly, validate(experienceUpdateSchema), async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;
    const data = { ...updateData };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    
    const exp = await req.prisma.experience.update({ 
      where: { id: parseInt(req.params.id) }, 
      data 
    });
    res.json({ experience: exp });
  } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try { await req.prisma.experience.delete({ where: { id: parseInt(req.params.id) } }); res.json({ success: true }); }
  catch (err) { next(err); }
});

export default router;
