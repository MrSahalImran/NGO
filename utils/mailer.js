const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
const fromName = process.env.EMAIL_FROM_NAME || "Virdh Ashram";

// Validate required credentials
if (!resendApiKey) {
  console.warn(
    "⚠️  RESEND_API_KEY not set - email functionality will be disabled"
  );
  console.warn("   Get your API key from https://resend.com/api-keys");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Verify configuration on boot
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
