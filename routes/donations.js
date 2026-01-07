const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const {
  submitDonation,
  getDonations,
  getDonationById,
  verifyDonation,
  rejectDonation,
} = require("../controllers/donationsController");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// @route   POST /api/donations/submit
// @desc    Submit donation details with payment proof
// @access  Public
router.post("/submit", upload.single("paymentProof"), submitDonation);

// @route   GET /api/donations
// @desc    Get all donations (Admin only)
// @access  Private (Admin)
router.get("/", auth, isAdmin, getDonations);

// @route   GET /api/donations/:id
// @desc    Get single donation (Admin only)
// @access  Private (Admin)
router.get("/:id", auth, isAdmin, getDonationById);

// @route   PUT /api/donations/:id/verify
// @desc    Verify and approve donation, generate certificate
// @access  Private (Admin)
router.put("/:id/verify", auth, isAdmin, verifyDonation);

// @route   PUT /api/donations/:id/reject
// @desc    Reject donation
// @access  Private (Admin)
router.put("/:id/reject", auth, isAdmin, rejectDonation);

module.exports = router;
