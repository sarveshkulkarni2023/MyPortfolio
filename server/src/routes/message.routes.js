import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import { escapeHTML } from '../utils/security.js';

const router = Router();

router.get('/', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const messages = await req.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ messages });
  } catch (err) { next(err); }
});

router.patch('/:id/read', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const msg = await req.prisma.message.update({ where: { id: parseInt(req.params.id) }, data: { read: true } });
    res.json({ message: msg });
  } catch (err) { next(err); }
});

router.post('/:id/reply', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const msg = await req.prisma.message.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!msg) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      // Escape all variables used in the HTML template to prevent XSS / HTML Injection
      const safeReplyText = escapeHTML(replyText).replace(/\n/g, '<br>');
      const safeName = escapeHTML(msg.name);
      const safeMessage = escapeHTML(msg.message).replace(/\n/g, '<br>');

      await transporter.sendMail({
        from: `"Sarvesh Kulkarni" <${process.env.SMTP_USER}>`,
        to: msg.email,
        subject: `Re: ${msg.subject || 'Portfolio Inquiry'}`,
        text: `${replyText}\n\n---\nOn ${new Date(msg.createdAt).toLocaleString()}, ${msg.name} wrote:\n> ${msg.message}`,
        html: `<p>${safeReplyText}</p><br><hr><p>On ${new Date(msg.createdAt).toLocaleString()}, <strong>${safeName}</strong> wrote:</p><blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 0; color: #555;">${safeMessage}</blockquote>`,
      });

      if (!msg.read) {
        await req.prisma.message.update({ where: { id: msg.id }, data: { read: true } });
      }

      return res.json({ success: true, message: 'Reply sent successfully.' });
    } else {
      return res.status(400).json({ 
        error: 'SMTP_NOT_CONFIGURED', 
        message: 'SMTP credentials are not configured on the server.' 
      });
    }
  } catch (err) { next(err); }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    await req.prisma.message.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
