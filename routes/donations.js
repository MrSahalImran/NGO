const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/admin");
const { upload } = require("../config/cloudinary");
const {
  submitDonation,
  getDonations,
  getDonationById,
  verifyDonation,
  rejectDonation,
  resendCertificate,
} = require("../controllers/donationsController");

// @route   POST /api/donations/submit
// @desc    Submit donation details with payment proof
// @access  Public
router.post("/submit", upload.single("paymentProof"), submitDonation);

// @route   GET /api/donations
// @desc    Get all donations (Admin only)
// @access  Private (Admin)
router.get("/", adminAuth, getDonations);

// @route   GET /api/donations/:id
// @desc    Get single donation (Admin only)
// @access  Private (Admin)
router.get("/:id", adminAuth, getDonationById);

// @route   PUT /api/donations/:id/verify
// @desc    Verify and approve donation, generate certificate
// @access  Private (Admin)
router.put("/:id/verify", adminAuth, verifyDonation);

// @route   PUT /api/donations/:id/reject
// @desc    Reject donation
// @access  Private (Admin)
router.put("/:id/reject", adminAuth, rejectDonation);

// @route   PUT /api/donations/:id/resend-certificate
// @desc    Resend 80G certificate to donor (Admin only)
// @access  Private (Admin)
router.put("/:id/resend-certificate", adminAuth, resendCertificate);

module.exports = router;
