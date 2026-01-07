const Registration = require("../models/Registration");
const Payment = require("../models/Payment");
const User = require("../models/User");

// GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const pendingRegistrations = await Registration.countDocuments({
      status: "pending",
    });
    const approvedRegistrations = await Registration.countDocuments({
      status: "approved",
    });
    const rejectedRegistrations = await Registration.countDocuments({
      status: "rejected",
    });

    const totalDonations = await Payment.countDocuments({
      status: "completed",
    });
    const totalAmount = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const recentRegistrations = await Registration.find()
      .sort({ registeredAt: -1 })
      .limit(5)
      .select("name email status registeredAt");

    const recentPayments = await Payment.find({ status: "completed" })
      .sort({ transactionDate: -1 })
      .limit(5)
      .select("donorName amount purpose transactionDate");

    const registrationTrends = await Registration.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$registeredAt" },
            month: { $month: "$registeredAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    const paymentTrends = await Payment.aggregate([
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
      registrations: {
        total: totalRegistrations,
        pending: pendingRegistrations,
        approved: approvedRegistrations,
        rejected: rejectedRegistrations,
      },
      payments: {
        totalDonations,
        totalAmount: totalAmount[0]?.total || 0,
      },
      recent: {
        registrations: recentRegistrations,
        payments: recentPayments,
      },
      trends: {
        registrations: registrationTrends,
        payments: paymentTrends,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
