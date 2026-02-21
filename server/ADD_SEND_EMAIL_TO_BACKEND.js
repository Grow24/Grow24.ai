/**
 * ADD THIS ROUTE TO YOUR EXPRESS BACKEND (e.g. server.js)
 *
 * The Contact Us → "Create email template" → "Send email" button calls
 * POST /api/send-email. Your backend currently only has /api/chat and /api/leads.
 * Add the block below AFTER your transporter is created and BEFORE the
 * WhatsApp or chat routes.
 *
 * 1. In your main server file, find where you have:
 *      app.post('/api/leads', ...)
 * 2. Insert this ENTIRE block BEFORE the /api/leads route (e.g. after
 *    "// WhatsApp integration" or right after transporter.verify).
 * 3. Update the health check so it lists /api/send-email:
 *      endpoints: ['/api/chat', '/api/leads', '/api/send-email']
 */

// -------- START: Copy from here --------
// Send email endpoint (Contact Us – Create Email Template – your own content/format)
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, cc, bcc, subject, html, text, attachments: rawAttachments } = req.body || {};

    const toList = Array.isArray(to)
      ? to
      : (typeof to === 'string' && to ? to.split(',').map((e) => e.trim()).filter(Boolean) : []);
    if (!toList.length) {
      return res.status(400).json({ success: false, message: 'At least one "to" recipient is required' });
    }
    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Email not configured. Set SENDGRID_API_KEY in the server environment.',
      });
    }

    const attachments = [];
    if (Array.isArray(rawAttachments)) {
      for (const a of rawAttachments) {
        if (a && typeof a.filename === 'string' && a.content != null) {
          attachments.push({
            filename: a.filename,
            content: Buffer.from(a.content, 'base64'),
          });
        }
      }
    }

    const from = process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@grow24.ai';
    const mailOptions = {
      from,
      to: toList,
      subject,
      html: html || undefined,
      text: text || undefined,
      attachments: attachments.length ? attachments : undefined,
    };
    if (cc && (Array.isArray(cc) ? cc.length : String(cc).trim())) {
      mailOptions.cc = Array.isArray(cc) ? cc : String(cc).split(',').map((e) => e.trim()).filter(Boolean);
    }
    if (bcc && (Array.isArray(bcc) ? bcc.length : String(bcc).trim())) {
      mailOptions.bcc = Array.isArray(bcc) ? bcc : String(bcc).split(',').map((e) => e.trim()).filter(Boolean);
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ Send-email: message sent to', toList.join(', '));
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Send-email error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to send email',
    });
  }
});
// -------- END: Copy to here --------
