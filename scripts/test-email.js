require("dotenv").config();
const { sendMailSafe } = require("../utils/mailer");

(async () => {
  try {
    const to = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!to) {
      console.error("No recipient configured (ADMIN_EMAIL or EMAIL_USER)");
      process.exit(1);
    }

    console.log("Sending test email to", to);
    const res = await sendMailSafe({
      to,
      subject: "Test: Approval Email Configuration",
      text: "This is a test email to verify SMTP configuration and approval email flow.",
      html: "<p>This is a <strong>test</strong> email to verify SMTP configuration and approval email flow.</p>",
    });

    console.log("Result:", res);
    if (!res.ok) process.exit(2);
  } catch (err) {
    console.error("Test email error:", err);
    process.exit(3);
  }
})();
