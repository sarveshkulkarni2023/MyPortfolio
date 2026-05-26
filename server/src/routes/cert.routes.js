import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validate, certSchema, certUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { const certifications = await req.prisma.certification.findMany({ orderBy: { issueDate: 'desc' } }); res.json({ certifications }); }
  catch (err) { next(err); }
});

router.post('/', authMiddleware, adminOnly, validate(certSchema), async (req, res, next) => {
  try {
    const data = { ...req.body, issueDate: new Date(req.body.issueDate), expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null };
    const cert = await req.prisma.certification.create({ data });
    res.status(201).json({ certification: cert });
  } catch (err) { next(err); }
});

router.put('/:id', authMiddleware, adminOnly, validate(certUpdateSchema), async (req, res, next) => {
  try {
    const { id, ...updateData } = req.body;
    const data = { ...updateData };
    if (data.issueDate) data.issueDate = new Date(data.issueDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);
    
    const cert = await req.prisma.certification.update({ 
      where: { id: parseInt(req.params.id) }, 
      data 
    });
    res.json({ certification: cert });
  } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try { await req.prisma.certification.delete({ where: { id: parseInt(req.params.id) } }); res.json({ success: true }); }
  catch (err) { next(err); }
});

export default router;
