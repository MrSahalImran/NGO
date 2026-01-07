const { sendMailSafe } = require("../utils/mailer");

// POST /api/contact
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const adminEmail =
      process.env.CONTACT_RECEIVER || "virdhashramjmu@gmail.com";

    const mailOptions = {
      to: adminEmail,
      subject: `Website Contact Form: ${subject}`,
      html: `
        <h2>New message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;">${message}</div>
        <br/>
        <p>--</p>
        <p>This message was sent from the website contact form.</p>
      `,
    };

    const result = await sendMailSafe(mailOptions);
    if (!result.ok) {
      return res
        .status(500)
        .json({
          message: "Failed to send email",
          error: result.error?.message || result.error,
        });
    }

    // Optionally send an acknowledgement to the sender (non-blocking)
    (async () => {
      try {
        await sendMailSafe({
          to: email,
          subject: "We received your message",
          html: `<p>Hi ${name},</p><p>Thanks for contacting us. We'll get back to you shortly.</p><p>— Vridh Ashram</p>`,
        });
      } catch (e) {
        // swallow errors
      }
    })();

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact send error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
