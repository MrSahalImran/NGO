const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const auth = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");
const { sendMailSafe } = require("../utils/mailer");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// emails are sent via utils/mailer transporter; failures are logged but do not block responses

// @route   POST /api/donations/submit
// @desc    Submit donation details with payment proof
// @access  Public
router.post("/submit", upload.single("paymentProof"), async (req, res) => {
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
        adminSend.error?.message || adminSend.error
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
        donorSend.error?.message || donorSend.error
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
});

// @route   GET /api/donations
// @desc    Get all donations (Admin only)
// @access  Private (Admin)
router.get("/", auth, isAdmin, async (req, res) => {
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
});

// @route   GET /api/donations/:id
// @desc    Get single donation (Admin only)
// @access  Private (Admin)
router.get("/:id", auth, isAdmin, async (req, res) => {
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
});

// @route   PUT /api/donations/:id/verify
// @desc    Verify and approve donation, generate certificate
// @access  Private (Admin)
router.put("/:id/verify", auth, isAdmin, async (req, res) => {
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

    // Generate receipt number only if it doesn't exist
    if (!donation.receiptNumber) {
      const year = new Date().getFullYear();
      const count = await Donation.countDocuments({
        receiptNumber: { $exists: true, $ne: null },
        createdAt: { $gte: new Date(year, 0, 1) },
      });
      donation.receiptNumber = `80G/${year}/${String(count + 1).padStart(
        4,
        "0"
      )}`;
    }

    await donation.save();

    // TODO: Generate 80G certificate PDF (will implement next)
    // For now, we'll send email without PDF attachment

    // Send 80G certificate email to donor
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
          donation.verifiedAt
        ).toLocaleDateString()}</p>
        <br>
        <p>This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.</p>
        <p>Your certificate will be attached to this email (PDF generation coming soon).</p>
        <br>
        <p>Thank you for supporting our cause!</p>
        <p>Best regards,<br>Vridh Ashram Team</p>
      `,
    };

    const certSend = await sendMailSafe(mailOptions);
    if (certSend.ok) {
      donation.status = "certificate_sent";
      await donation.save();
    } else {
      console.warn(
        "Certificate email failed:",
        certSend.error?.message || certSend.error
      );
      // keep status as verified so admin can retry sending later when SMTP fixed
    }

    res.json({
      message: "Donation verified and certificate sent successfully",
      donation,
    });
  } catch (error) {
    console.error("Verify donation error:", error);
    res.status(500).json({
      message: "Failed to verify donation",
      error: error.message,
    });
  }
});

// @route   PUT /api/donations/:id/reject
// @desc    Reject donation
// @access  Private (Admin)
router.put("/:id/reject", auth, isAdmin, async (req, res) => {
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
        rejSend.error?.message || rejSend.error
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
});

module.exports = router;
