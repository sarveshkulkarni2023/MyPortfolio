import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validate, analyticsSchema } from '../validators/schemas.js';

const router = Router();

// POST /api/analytics/track — public
router.post('/track', validate(analyticsSchema), async (req, res, next) => {
  try {
    await req.prisma.analytics.create({
      data: {
        event: req.body.event,
        metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : null,
        ip: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
      },
    });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// GET /api/admin/analytics — admin
router.get('/', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const [pageViews, downloads, projectViews, messages] = await Promise.all([
      req.prisma.analytics.count({ where: { event: 'PAGE_VIEW' } }),
      req.prisma.analytics.count({ where: { event: 'RESUME_DOWNLOAD' } }),
      req.prisma.analytics.count({ where: { event: 'PROJECT_VIEW' } }),
      req.prisma.message.count(),
    ]);
    const projects = await req.prisma.project.count();
    const recentEvents = await req.prisma.analytics.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ pageViews, downloads, projectViews, projects, messages, recentEvents });
  } catch (err) { next(err); }
});

export default router;
