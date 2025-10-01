const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require("express-validator");
const Payment = require("../models/Payment");

const router = express.Router();

// Create payment intent
router.post(
  "/create-payment-intent",
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("donorName").notEmpty().withMessage("Donor name is required"),
    body("donorEmail").isEmail().withMessage("Please include a valid email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, currency = "usd" } = req.body;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const paymentData = req.body;
      const payment = new Payment({
        ...paymentData,
        status: "completed",
      });

      await payment.save();
      res
        .status(201)
        .json({ message: "Payment recorded successfully", payment });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Get all payments (for admin)
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ transactionDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get payment statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const totalAmount = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalDonations = await Payment.countDocuments({
      status: "completed",
    });

    const monthlyStats = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: {
            year: { $year: "$transactionDate" },
            month: { $month: "$transactionDate" },
          },
          amount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      totalAmount: totalAmount[0]?.total || 0,
      totalDonations,
      monthlyStats,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
