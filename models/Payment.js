const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
  },
  donorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  donorPhone: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  currency: {
    type: String,
    default: "USD",
    uppercase: true,
  },
  donationType: {
    type: String,
    enum: ["one-time", "monthly", "yearly"],
    default: "one-time",
  },
  purpose: {
    type: String,
    enum: [
      "education",
      "healthcare",
      "environment",
      "poverty-relief",
      "general",
    ],
    default: "general",
  },
  message: {
    type: String,
    trim: true,
  },
  stripePaymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
