const Donation = require("../models/Donation");
const { cloudinary } = require("../config/cloudinary");
const { sendMailSafe } = require("../utils/mailer");
const generate80G = require("../utils/generate80g");

// Upload a Buffer to Cloudinary and return { url, public_id }
const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "certificates", public_id: filename },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );

    stream.end(buffer);
  });
};

// POST /api/donations/submit
exports.submitDonation = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Payment proof is required" });
    }

    const { donorName, email, phone, amount, transactionId, message } =
      req.body;

    // Validate required fields
    if (!donorName || !email || !amount || !transactionId) {
      // Delete uploaded file if validation fails
      await cloudinary.uploader.destroy(req.file.filename);
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Create donation record
    const donation = new Donation({
      donorName,
      email,
      phone,
      amount: parseFloat(amount),
      transactionId,
      message,
      paymentProof: {
        url: req.file.path,
        cloudinaryId: req.file.filename,
      },
      status: "pending",
    });

    await donation.save();

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@virdhashram.org";
    const mailOptions = {
      to: adminEmail,
      subject: `New Donation Received - ₹${amount}`,
      html: `
        <h2>New Donation Submission</h2>
        <p><strong>Donor Name:</strong> ${donorName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
        <p><strong>Payment Proof:</strong> <a href="${
          req.file.path
        }">View Proof</a></p>
        <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        <br>
        <p>Please login to the admin dashboard to verify and approve this donation.</p>
      `,
    };

    // send admin email (non-blocking)
    const adminSend = await sendMailSafe(mailOptions);
    if (!adminSend.ok) {
      console.warn(
        "Admin email failed:",
        adminSend.error?.message || adminSend.error,
      );
    }

    // Send confirmation email to donor
    const donorMailOptions = {
      to: email,
      subject: "80G Certificate Request Received - Vridh Ashram",
      html: `
        <h2>Thank You for Your Donation!</h2>
        <p>Dear ${donorName},</p>
        <p>We have received your request for 80G certificate.</p>
        <p>Your donation will be confirmed by our team. Your 80G certificate will be generated and emailed to you after confirmation.</p>
        <br>
        <p>Thank you for supporting Vridh Ashram!</p>
        <p>Best regards,<br>Vridh Ashram Team</p>
      `,
    };

    // send donor confirmation (non-blocking)
    const donorSend = await sendMailSafe(donorMailOptions);
    if (!donorSend.ok) {
      console.warn(
        "Donor confirmation failed:",
        donorSend.error?.message || donorSend.error,
      );
    }

    res.status(201).json({
      message:
        "Donation submitted successfully. You will receive your 80G certificate via email after verification.",
      donation: {
        id: donation._id,
        donorName: donation.donorName,
        amount: donation.amount,
        status: donation.status,
      },
    });
  } catch (error) {
    console.error("Donation submission error:", error);
    // Attempt to cleanup uploaded proof only if document not saved
    try {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
    } catch (deleteError) {
      console.error("Error deleting file from Cloudinary:", deleteError);
    }
    res.status(500).json({
      message: "Failed to submit donation",
      error: error.message,
    });
  }
};

// GET /api/donations
exports.getDonations = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const donations = await Donation.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(donations);
  } catch (error) {
    console.error("Fetch donations error:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

// GET /api/donations/:id
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(donation);
  } catch (error) {
    console.error("Fetch donation error:", error);
    res.status(500).json({ message: "Failed to fetch donation" });
  }
};

// PUT /api/donations/:id/verify
exports.verifyDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Donation has already been processed" });
    }

    // Update donation status
    donation.status = "verified";
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = new Date();

    // Generate receipt number if not exists
    if (!donation.receiptNumber) {
      const year = new Date().getFullYear();

      const count = await Donation.countDocuments({
        receiptNumber: { $exists: true, $ne: null },
        createdAt: { $gte: new Date(year, 0, 1) },
      });

      donation.receiptNumber = `80G/${year}/${String(count + 1).padStart(
        4,
        "0",
      )}`;
    }

    await donation.save();

    // Generate 80G Certificate PDF
    let pdfBuffer = null;

    try {
      pdfBuffer = await generate80G(donation, {
        name: process.env.ORG_NAME,
        address: process.env.ORG_ADDRESS,
        signatoryName: process.env.ORG_SIGNATORY,
      });

      // Upload to Cloudinary (for storage only)
      try {
        const filename = `80G_${donation._id}_${Date.now()}`;

        const uploadRes = await uploadBufferToCloudinary(pdfBuffer, filename);

        donation.certificateUrl = uploadRes.url;
        donation.certificateCloudinaryId = uploadRes.public_id;
        await donation.save();
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
      }
    } catch (pdfErr) {
      console.error("80G PDF generation failed:", pdfErr);
    }

    // 🔥 IMPORTANT FIX:
    // Always attach buffer instead of Cloudinary URL
    const attachments = [];

    if (pdfBuffer) {
      attachments.push({
        filename: `${donation.receiptNumber || "80G-Certificate"}.pdf`,
        content: pdfBuffer,
      });
    }

    const mailOptions = {
      to: donation.email,
      subject: "80G Tax Exemption Certificate - Vridh Ashram",
      html: `
        <h2>80G Tax Exemption Certificate</h2>
        <p>Dear ${donation.donorName},</p>
        <p>Thank you for your generous donation to Vridh Ashram.</p>
        <br>
        <p><strong>Receipt Number:</strong> ${donation.receiptNumber}</p>
        <p><strong>Donation Amount:</strong> ₹${donation.amount}</p>
        <p><strong>Transaction ID:</strong> ${donation.transactionId}</p>
        <p><strong>Date:</strong> ${new Date(
          donation.verifiedAt,
        ).toLocaleDateString()}</p>
        <br>
        <p>This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.</p>
        ${
          donation.certificateUrl
            ? `<p>You can also download it here: <a href="${donation.certificateUrl}">Download Certificate</a></p>`
            : ""
        }
        <br>
        <p>Thank you for supporting our cause!</p>
        <p>Best regards,<br>Vridh Ashram Team</p>
      `,
      attachments,
    };

    const certSend = await sendMailSafe(mailOptions);

    if (certSend.ok) {
      donation.status = "certificate_sent";
      donation.mailFailures = [];
      await donation.save();
    } else {
      console.error("Certificate email failed:", certSend.error);

      donation.mailFailures = donation.mailFailures || [];
      donation.mailFailures.push({
        when: new Date(),
        error:
          (certSend.error && certSend.error.message) ||
          certSend.error ||
          "unknown",
      });

      await donation.save();
    }

    return res.json({
      message: certSend.ok
        ? "Donation verified and certificate sent successfully"
        : "Donation verified but email sending failed",
      donation,
    });
  } catch (error) {
    console.error("Verify donation error:", error);

    return res.status(500).json({
      message: "Failed to verify donation",
      error: error.message,
    });
  }
};

// PUT /api/donations/:id/reject
exports.rejectDonation = async (req, res) => {
  try {
    const { reason } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Donation has already been processed" });
    }

    donation.status = "rejected";
    donation.rejectionReason = reason || "Payment verification failed";
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = new Date();

    await donation.save();

    // Send rejection email to donor
    const mailOptions = {
      to: donation.email,
      subject: "Donation Verification Update - Vridh Ashram",
      html: `
        <h2>Donation Verification Update</h2>
        <p>Dear ${donation.donorName},</p>
        <p>We regret to inform you that we could not verify your donation submission.</p>
        <p><strong>Reason:</strong> ${donation.rejectionReason}</p>
        <br>
        <p>If you believe this is an error, please contact us with your transaction details.</p>
        <p>Transaction ID: ${donation.transactionId}</p>
        <br>
        <p>Best regards,<br>Vridh Ashram Team</p>
      `,
    };

    const rejSend = await sendMailSafe(mailOptions);
    if (!rejSend.ok) {
      console.warn(
        "Rejection email failed:",
        rejSend.error?.message || rejSend.error,
      );
    }

    res.json({
      message: "Donation rejected successfully",
      donation,
    });
  } catch (error) {
    console.error("Reject donation error:", error);
    res.status(500).json({
      message: "Failed to reject donation",
      error: error.message,
    });
  }
};

// PUT /api/donations/:id/resend-certificate
exports.resendCertificate = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      console.warn("Resend failed: Donation not found:", req.params.id);
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status === "pending") {
      console.warn(
        `Resend blocked: Donation ${donation._id} still pending verification`,
      );
      return res
        .status(400)
        .json({ message: "Donation is still pending verification" });
    }

    let pdfBuffer = null;

    // 1️⃣ Try fetching existing certificate safely
    if (donation.certificateCloudinaryId) {
      try {
        const cloudinary = require("cloudinary").v2;
        const axios = require("axios");

        const result = await cloudinary.api.resource(
          donation.certificateCloudinaryId,
          { resource_type: "raw" },
        );

        const response = await axios.get(result.secure_url, {
          responseType: "arraybuffer",
        });

        pdfBuffer = Buffer.from(response.data);

        console.log(
          `Existing certificate fetched from Cloudinary for donation ${donation._id}`,
        );
      } catch (err) {
        console.error(
          `Failed fetching Cloudinary certificate for donation ${donation._id}:`,
          err.message,
        );
      }
    }

    // 2️⃣ If no buffer → regenerate
    if (!pdfBuffer) {
      try {
        pdfBuffer = await generate80G(donation, {
          name: process.env.ORG_NAME,
          address: process.env.ORG_ADDRESS,
          signatoryName: process.env.ORG_SIGNATORY,
        });

        console.log(`New certificate generated for donation ${donation._id}`);

        // upload for storage
        try {
          const filename = `80G_${donation._id}_${Date.now()}`;
          const uploadRes = await uploadBufferToCloudinary(pdfBuffer, filename);

          donation.certificateUrl = uploadRes.url;
          donation.certificateCloudinaryId = uploadRes.public_id;
          await donation.save();

          console.log(
            `Certificate uploaded to Cloudinary for donation ${donation._id}`,
          );
        } catch (uploadErr) {
          console.error(
            `Cloudinary upload failed for donation ${donation._id}:`,
            uploadErr.message,
          );
        }
      } catch (pdfErr) {
        console.error(
          `80G PDF generation failed for donation ${donation._id}:`,
          pdfErr.message,
        );

        return res.status(500).json({
          message: "Failed to generate certificate",
        });
      }
    }

    // 3️⃣ Always attach buffer (NO URL PATH)
    const attachments = [
      {
        filename: `${donation.receiptNumber || "80G-Certificate"}.pdf`,
        content: pdfBuffer,
      },
    ];

    const mailOptions = {
      to: donation.email,
      subject: "80G Tax Exemption Certificate - Vridh Ashram",
      html: `
        <h2>80G Tax Exemption Certificate</h2>
        <p>Dear ${donation.donorName},</p>
        <p>Please find attached your 80G certificate for donation.</p>
        <p><strong>Receipt Number:</strong> ${donation.receiptNumber}</p>
        <p><strong>Donation Amount:</strong> ₹${donation.amount}</p>
        <br>
        <p>Best regards,<br>Vridh Ashram Team</p>
      `,
      attachments,
    };

    const send = await sendMailSafe(mailOptions);

    if (send.ok) {
      console.log(
        `✅ Certificate email resent successfully to ${donation.email} | Receipt: ${donation.receiptNumber}`,
      );

      donation.status = "certificate_sent";
      donation.mailFailures = [];
      await donation.save();

      return res.json({
        message: "Certificate resent successfully",
        donation,
      });
    }

    // ❌ Email failed
    console.error(
      `❌ Certificate resend failed for ${donation.email} | Receipt: ${donation.receiptNumber}`,
    );
    console.error("Error details:", send.error);

    donation.mailFailures = donation.mailFailures || [];
    donation.mailFailures.push({
      when: new Date(),
      error: (send.error && send.error.message) || send.error || "unknown",
    });

    await donation.save();

    return res.status(500).json({
      message: "Failed to resend certificate",
    });
  } catch (error) {
    console.error("Resend certificate controller crashed:", error);

    return res.status(500).json({
      message: "Failed to resend certificate",
      error: error.message,
    });
  }
};
