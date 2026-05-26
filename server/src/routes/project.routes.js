import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validate, projectSchema, projectUpdateSchema } from '../validators/schemas.js';

const router = Router();


// GET /api/projects — public
router.get('/', async (req, res, next) => {
  try {
    const projects = await req.prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    res.json({ projects });
  } catch (err) { next(err); }
});

// GET /api/projects/:slug — public
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await req.prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await req.prisma.project.update({ where: { id: project.id }, data: { views: { increment: 1 } } });
    res.json({ project });
  } catch (err) { next(err); }
});

// POST /api/projects — admin
router.post('/', authMiddleware, adminOnly, validate(projectSchema), async (req, res, next) => {
  try {
    const { id, createdAt, updatedAt, images, ...createData } = req.body;
    const project = await req.prisma.project.create({ data: createData });
    res.status(201).json({ project });
  } catch (err) { next(err); }
});

// PUT /api/projects/:id — admin
router.put('/:id', authMiddleware, adminOnly, validate(projectUpdateSchema), async (req, res, next) => {
  try {
    const { id, createdAt, updatedAt, images, views, ...updateData } = req.body;
    const project = await req.prisma.project.update({ where: { id: parseInt(req.params.id) }, data: updateData });
    res.json({ project });
  } catch (err) { next(err); }
});

// DELETE /api/projects/:id — admin
router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    await req.prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// PATCH /api/projects/reorder — admin
router.patch('/reorder', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { ids } = req.body;
    await Promise.all(ids.map((id, i) => req.prisma.project.update({ where: { id }, data: { sortOrder: i } })));
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
