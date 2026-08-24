const nodemailer = require('nodemailer');

function env(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getSmtpUser() {
  return env('SMTP_USER') || env('EMAIL_USER');
}

function getSmtpPass() {
  return env('SMTP_PASS') || env('EMAIL_PASSWORD');
}

function getMailFrom() {
  return env('EMAIL_FROM') || getSmtpUser() || 'noreply@grow24.ai';
}

function inferZohoRegion(user) {
  const explicit = (env('ZOHO_REGION') || '').toLowerCase();
  if (explicit) return explicit;

  const email = String(user || '').toLowerCase();
  if (email.endsWith('@zohomail.in') || email.endsWith('@zoho.in') || email.endsWith('.zoho.in')) {
    return 'in';
  }
  if (email.endsWith('@zohomail.eu') || email.endsWith('@zoho.eu')) return 'eu';
  if (email.endsWith('@zohomail.com.au') || email.endsWith('@zoho.com.au')) return 'au';
  return 'com';
}

function getZohoHost(user) {
  const explicit = env('SMTP_HOST') || env('EMAIL_HOST');
  if (explicit) return explicit;

  const region = inferZohoRegion(user);
  const prefix = env('ZOHO_SMTP_PRO').toLowerCase() === 'true' ? 'smtppro' : 'smtp';
  if (region === 'in') return `${prefix}.zoho.in`;
  if (region === 'eu') return `${prefix}.zoho.eu`;
  if (region === 'au') return `${prefix}.zoho.com.au`;
  return `${prefix}.zoho.com`;
}

function isEmailConfigured() {
  const user = getSmtpUser();
  const pass = getSmtpPass();
  if (user && pass) return true;
  return Boolean(env('SENDGRID_API_KEY'));
}

function createZohoTransporter(user, pass) {
  const host = getZohoHost(user);
  const port = Number(env('SMTP_PORT') || env('EMAIL_PORT') || 465);
  const secure = env('SMTP_SECURE')
    ? env('SMTP_SECURE').toLowerCase() === 'true'
    : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });
}

function createMailTransporter() {
  const user = getSmtpUser();
  const pass = getSmtpPass();

  if (user && pass) {
    return {
      name: 'Zoho',
      transporter: createZohoTransporter(user, pass),
    };
  }

  if (env('SENDGRID_API_KEY')) {
    return {
      name: 'SendGrid',
      transporter: nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: env('SENDGRID_API_KEY'),
        },
      }),
    };
  }

  return { name: null, transporter: null };
}

module.exports = {
  createMailTransporter,
  getMailFrom,
  isEmailConfigured,
};
