const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const adminAuth = require("../middleware/admin");
const {
  createPaymentIntent,
  confirmPayment,
  getPayments,
  getPaymentById,
  getStatsSummary,
} = require("../controllers/paymentsController");

// Create payment intent
router.post(
  "/create-payment-intent",
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("donorEmail").isEmail().withMessage("Please include a valid email"),
  ],
  createPaymentIntent
);

// Confirm payment
router.post(
  "/confirm",
  [
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("donorEmail").isEmail().withMessage("Please include a valid email"),
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("stripePaymentId").notEmpty().withMessage("Payment ID is required"),
  ],
  confirmPayment
);

// Get all payments (admin only)
router.get("/", adminAuth, getPayments);

// Get payment statistics (admin only) — declared before "/:id" so "stats"
// isn't captured as an id param
router.get("/stats/summary", adminAuth, getStatsSummary);

// Get payment by ID (admin only)
router.get("/:id", adminAuth, getPaymentById);

module.exports = router;
