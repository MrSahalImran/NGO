const nodemailer = require("nodemailer");

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || 465);
const secure = process.env.SMTP_SECURE
  ? /^(true|1|yes)$/i.test(process.env.SMTP_SECURE)
  : port === 465; // true for 465, false for 587

const authUser = process.env.EMAIL_USER;
const authPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: authUser && authPass ? { user: authUser, pass: authPass } : undefined,
});

// Optional: verify transporter on boot and log but don't crash
transporter
  .verify()
  .then(() => {
    console.log(
      `Email transporter ready (host=${host}, port=${port}, secure=${secure})`
    );
  })
  .catch((err) => {
    console.warn("Email transporter verification failed:", err?.message || err);
  });

/**
 * Send mail safely without throwing. Returns { ok: boolean, info?, error? }
 */
async function sendMailSafe(options) {
  try {
    const fromName = process.env.EMAIL_FROM_NAME || "Virdh Ashram";
    const fromAddress = process.env.EMAIL_FROM || authUser;
    const from =
      options.from ||
      (fromAddress ? `${fromName} <${fromAddress}>` : undefined);

    const info = await transporter.sendMail({ ...options, from });
    return { ok: true, info };
  } catch (error) {
    console.error("sendMailSafe error:", error?.message || error);
    return { ok: false, error };
  }
}

module.exports = { transporter, sendMailSafe };
