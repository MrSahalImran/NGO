const Counter = require("../models/Counter");

/**
 * Atomically generate the next 80G receipt number for the given year,
 * e.g. "80G/2026/0001". Uses an atomic $inc so two concurrent donation
 * verifications can never receive the same number (previously derived from
 * countDocuments(), which was racy and could collide on the unique index).
 */
async function nextReceiptNumber(date = new Date()) {
  const year = date.getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    `receipt:${year}`,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `80G/${year}/${String(counter.seq).padStart(4, "0")}`;
}

module.exports = { nextReceiptNumber };
