const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 587); // 587 works better on cloud platforms
const secure = process.env.SMTP_SECURE
  ? /^(true|1|yes)$/i.test(process.env.SMTP_SECURE)
  : port === 465; // true for 465, false for 587

const authUser = process.env.EMAIL_USER;
const authPass = process.env.EMAIL_PASS;

// Validate required credentials
if (!authUser || !authPass) {
  console.warn(
    "⚠️  EMAIL_USER or EMAIL_PASS not set - email functionality will be disabled"
  );
  console.warn("   For Gmail: Generate an App Password at https://myaccount.google.com/apppasswords");
}

const transporter = authUser && authPass
  ? nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: authUser, pass: authPass },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      requireTLS: port === 587,
    })
  : null;

// Optional: verify transporter on boot and log but don't crash
if (transporter) {
  transporter
    .verify()
    .then(() => {
      console.log(
        `✅ Email transporter ready (${authUser} via ${host}:${port})`
      );
    })
    .catch((err) => {
      console.warn(
        `⚠️  Email transporter verification failed: ${err?.message || err}`
      );
      console.warn(
        "   Check EMAIL_USER and EMAIL_PASS. For Gmail, use an App Password."
      );
    });
} else {
  console.warn("⚠️  Email transporter not configured - skipping email service");
}

/**
 * Send mail safely without throwing. Returns { ok: boolean, info?, error? }
 */
async function sendMailSafe(options) {
  try {
    if (!transporter) {
      console.warn("Email transporter not configured - email not sent");
      return { ok: false, error: new Error("Email transporter not configured") };
    }

    const fromName = process.env.EMAIL_FROM_NAME || "Virdh Ashram";
    const fromAddress = process.env.EMAIL_FROM || authUser;
    const from =
      options.from ||
      (fromAddress ? `${fromName} <${fromAddress}>` : undefined);

    const info = await transporter.sendMail({ ...options, from });
    console.log(`✅ Email sent successfully (${info.messageId})`);
    return { ok: true, info };
  } catch (error) {
    console.error("sendMailSafe error:", error?.message || error);
    return { ok: false, error };
  }
}

module.exports = { transporter, sendMailSafe };
