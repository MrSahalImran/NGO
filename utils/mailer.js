const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 587);
const secure = process.env.SMTP_SECURE
  ? /^(true|1|yes)$/i.test(process.env.SMTP_SECURE)
  : port === 465;

const authUser = process.env.EMAIL_USER;
const authPass = process.env.EMAIL_PASS;

// Validate required credentials
if (!authUser || !authPass) {
  console.warn(
    "⚠️  RESEND_API_KEY not set - email functionality will be disabled"
  );
  console.warn("   Get your API key from https://resend.com/api-keys");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (resend) {
  console.log(
    `✅ Resend email service configured (from: ${fromName} <${fromEmail}>)`
  );
} else {
  console.warn("⚠️  Resend not configured - skipping email service");
}

/**
 * Send mail safely without throwing. Returns { ok: boolean, info?, error? }
 *
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text content (optional)
 * @param {string} [options.from] - From address (optional, uses default)
 */
async function sendMailSafe(options) {
  try {
    if (!resend) {
      console.warn("Resend not configured - email not sent");
      return { ok: false, error: new Error("Resend not configured") };
    }

    const from = options.from || `${fromName} <${fromEmail}>`;

    // Resend API format
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("Resend error:", error);
      return { ok: false, error };
    }

    console.log(`✅ Email sent successfully (ID: ${data.id})`);
    return { ok: true, info: data };
  } catch (error) {
    console.error("sendMailSafe error:", error?.message || error);
    return { ok: false, error };
  }
}

// Export both for backwards compatibility
module.exports = {
  sendMailSafe,
  resend,
  // Legacy exports (deprecated but kept for compatibility)
  transporter: { sendMail: sendMailSafe },
};
