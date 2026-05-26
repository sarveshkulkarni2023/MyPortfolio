import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { validateImageMagicBytes } from '../utils/security.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Enforce 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', authMiddleware, adminOnly, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or file type not allowed' });
    }

    // Verify magic bytes to prevent file mime-spoofing
    if (!validateImageMagicBytes(req.file.buffer)) {
      return res.status(400).json({ error: 'Security verification failed: invalid image file signature.' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Fallback: return base64 data URL for development
      const b64 = req.file.buffer.toString('base64');
      return res.json({ url: `data:${req.file.mimetype};base64,${b64}` });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'command-center', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(req.file.buffer);
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) { next(err); }
});

export default router;
