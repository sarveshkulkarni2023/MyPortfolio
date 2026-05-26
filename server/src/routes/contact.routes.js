import { Router } from 'express';
import nodemailer from 'nodemailer';
import { validate, contactSchema } from '../validators/schemas.js';

const router = Router();

router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    await req.prisma.message.create({ data: { name, email, subject, message } });

    // Send email if SMTP is configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[Portfolio] ${subject || 'New message'} from ${name}`,
        html: `<h3>New message from ${name}</h3><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject || 'N/A'}</p><p>${message}</p>`,
      });
    }

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) { next(err); }
});

export default router;
