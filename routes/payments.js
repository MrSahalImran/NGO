const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
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

// Get all payments (for admin)
router.get("/", getPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Get payment statistics
router.get("/stats/summary", getStatsSummary);

module.exports = router;
