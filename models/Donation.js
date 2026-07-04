const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentProof: {
      url: {
        type: String,
        required: true,
      },
      cloudinaryId: {
        type: String,
        required: true,
      },
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "certificate_sent"],
      default: "pending",
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    certificateUrl: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Receipt numbers are assigned atomically at verification time via
// utils/receiptNumber.js — see donationsController.verifyDonation.

module.exports = mongoose.model("Donation", donationSchema);
