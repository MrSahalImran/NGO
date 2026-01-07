const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require("express-validator");
const Payment = require("../models/Payment");

// POST /api/payments/create-payment-intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency = "usd" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// POST /api/payments/confirm
exports.confirmPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const paymentData = req.body;
    const payment = new Payment({ ...paymentData, status: "completed" });

    await payment.save();
    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// GET /api/payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ transactionDate: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// GET /api/payments/:id
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// GET /api/payments/stats/summary
exports.getStatsSummary = async (req, res) => {
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
};
