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

function getSalesSmtpUser() {
  return env('SALES_EMAIL_USER') || env('EMAIL_SALES_USER');
}

function getSalesSmtpPass() {
  return env('SALES_EMAIL_PASSWORD') || env('EMAIL_SALES_PASSWORD') || env('SALES_EMAIL_PASS');
}

/** @param {'support'|'sales'} [role] */
function getMailFrom(role = 'support') {
  if (role === 'sales') {
    return (
      env('EMAIL_FROM_SALES') ||
      env('SALES_EMAIL_FROM') ||
      (getSalesSmtpUser() ? `Grow24 Sales <${getSalesSmtpUser()}>` : 'Grow24 Sales <sales@grow24.ai>')
    );
  }
  return (
    env('EMAIL_FROM_SUPPORT') ||
    env('EMAIL_FROM') ||
    getSmtpUser() ||
    'Grow24 Support <support@grow24.ai>'
  );
}

/**
 * Contact Us / Create email → support
 * Harness CTA subscribe (cta-bar / cta-section) → sales
 * @param {string} [source]
 */
function resolveMailRole(source) {
  const s = String(source || '').toLowerCase().trim();
  if (s === 'cta-bar' || s === 'cta-section' || s === 'subscribe' || s === 'newsletter') {
    return 'sales';
  }
  return 'support';
}

function getEmailService() {
  return (env('EMAIL_SERVICE') || env('SMTP_SERVICE') || 'zoho').toLowerCase();
}

function isPersonalZohoAddress(user) {
  const domain = String(user || '').toLowerCase().split('@')[1] || '';
  return (
    domain === 'zoho.com' ||
    domain === 'zoho.in' ||
    domain === 'zoho.eu' ||
    domain.startsWith('zohomail.') ||
    domain.startsWith('zoho.')
  );
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

function useZohoSmtpPro(user) {
  const explicit = env('ZOHO_SMTP_PRO').toLowerCase();
  if (explicit === 'true') return true;
  if (explicit === 'false') return false;
  return Boolean(user) && !isPersonalZohoAddress(user);
}

function getZohoHost(user) {
  const explicit = env('SMTP_HOST') || env('EMAIL_HOST');
  if (explicit) return explicit;

  const region = inferZohoRegion(user);
  const prefix = useZohoSmtpPro(user) ? 'smtppro' : 'smtp';
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

function createGenericSmtpTransporter(user, pass) {
  const host = env('SMTP_HOST') || env('EMAIL_HOST');
  const service = getEmailService();

  if (service === 'gmail' && user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(env('SMTP_PORT') || env('EMAIL_PORT') || 587),
      secure: env('SMTP_SECURE').toLowerCase() === 'true',
      auth: { user, pass },
    });
  }

  return null;
}

function createTransporterForCredentials(user, pass) {
  const service = getEmailService();

  if (user && pass && (service === 'zoho' || service === '')) {
    return {
      name: `Zoho (${getZohoHost(user)})`,
      transporter: createZohoTransporter(user, pass),
    };
  }

  if (user && pass) {
    const transporter = createGenericSmtpTransporter(user, pass);
    if (transporter) {
      return {
        name: service === 'gmail' ? 'Gmail' : (env('SMTP_HOST') || env('EMAIL_HOST') || service),
        transporter,
      };
    }
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

function createMailTransporter() {
  return createTransporterForCredentials(getSmtpUser(), getSmtpPass());
}

/**
 * Prefer dedicated sales mailbox credentials when set.
 * Otherwise fall back to support SMTP (sales@ must be a Zoho alias / Send Mail As of support).
 * @param {'support'|'sales'} [role]
 */
function getMailTransport(role = 'support') {
  if (role === 'sales') {
    const salesUser = getSalesSmtpUser();
    const salesPass = getSalesSmtpPass();
    if (salesUser && salesPass) {
      return createTransporterForCredentials(salesUser, salesPass);
    }
  }
  return createMailTransporter();
}

module.exports = {
  createMailTransporter,
  getMailTransport,
  getMailFrom,
  resolveMailRole,
  isEmailConfigured,
};
