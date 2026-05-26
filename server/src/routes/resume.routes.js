import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validate, resumeSchema, resumeUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const resumes = await req.prisma.resume.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } });
    res.json({ resumes });
  } catch (err) { next(err); }
});

router.post('/', authMiddleware, adminOnly, validate(resumeSchema), async (req, res, next) => {
  try { const resume = await req.prisma.resume.create({ data: req.body }); res.status(201).json({ resume }); }
  catch (err) { next(err); }
});

router.put('/:id', authMiddleware, adminOnly, validate(resumeUpdateSchema), async (req, res, next) => {
  try {
    const { id, downloads, createdAt, updatedAt, ...updateData } = req.body;
    const resume = await req.prisma.resume.update({
      where: { id: parseInt(req.params.id) },
      data: updateData
    });
    res.json({ resume });
  } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try { await req.prisma.resume.delete({ where: { id: parseInt(req.params.id) } }); res.json({ success: true }); }
  catch (err) { next(err); }
});

export default router;
