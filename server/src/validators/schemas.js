import { z } from 'zod';

export function validate(schema) {
  return (req, _res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

// ---- Auth schemas ----
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1),
});

// ---- Project schemas ----
export const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  longDesc: z.string().optional(),
  techStack: z.string(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().optional(),
  category: z.string().min(1),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  sortOrder: z.number().int().optional(),
});

// ---- Skill schemas ----
export const skillSchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  proficiency: z.number().int().min(0).max(100),
  categoryId: z.number().int(),
});

export const skillCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
});

// ---- Resume schema ----
export const resumeSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  driveUrl: z.string().url(),
  active: z.boolean().optional(),
});

// ---- Certification schema ----
export const certSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  image: z.string().optional(),
});

// ---- Experience schema ----
export const experienceSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  type: z.enum(['INTERNSHIP', 'HACKATHON', 'ACHIEVEMENT', 'WORK']),
  description: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  techStack: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

// ---- Contact schema ----
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
});

// ---- Analytics schema ----
export const analyticsSchema = z.object({
  event: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

// ---- Partial update schemas to prevent mass assignment ----
export const projectUpdateSchema = projectSchema.partial();
export const skillUpdateSchema = skillSchema.partial();
export const skillCategoryUpdateSchema = skillCategorySchema.partial();
export const resumeUpdateSchema = resumeSchema.partial();
export const certUpdateSchema = certSchema.partial();
export const experienceUpdateSchema = experienceSchema.partial();

