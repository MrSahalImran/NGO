const mongoose = require("mongoose");

// Simple atomic sequence counter. One document per named sequence
// (e.g. "receipt:2026"); `findByIdAndUpdate` with `$inc` guarantees each
// caller gets a distinct value even under concurrent requests.
const counterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
