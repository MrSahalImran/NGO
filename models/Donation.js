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

// Generate receipt number before saving
donationSchema.pre("save", async function (next) {
  if (this.isNew && this.status === "verified" && !this.receiptNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Donation").countDocuments({
      createdAt: { $gte: new Date(year, 0, 1) },
    });
    this.receiptNumber = `80G/${year}/${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Donation", donationSchema);
