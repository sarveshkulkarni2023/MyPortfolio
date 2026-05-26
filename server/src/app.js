import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import skillRoutes from './routes/skill.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import certRoutes from './routes/cert.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import contactRoutes from './routes/contact.routes.js';
import githubRoutes from './routes/github.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import messageRoutes from './routes/message.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const prisma = new PrismaClient();

// Security Headers: configure Helmet with strict CSP & Frame options
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration: enforce whitelisted origins securely (do not allow wildcards when credentials: true)
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting: prevent abuse and brute force
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Body parsing limits to prevent DoS via massive payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make prisma available
app.use((req, _res, next) => { req.prisma = prisma; next(); });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/messages', messageRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'online', timestamp: new Date().toISOString() }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Command Center API online on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(0); });
