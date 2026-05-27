const mongoose = require("mongoose");

const bankingFraudSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, index: true },
  accountId: { type: String },
  timestamp: { type: String, index: true },
  amount: { type: String },
  merchantCategory: { type: String },
  transactionType: { type: String },
  deviceType: { type: String },
  locationCity: { type: String, index: true },
  riskScore: { type: String },
  isFraud: { type: String },
  status: { type: String, default: "Pending", index: true },
  areaStatus: { type: String, default: "Pending" },
  area: { type: String, index: true },
  evidenceUrl: { type: String },
  citizenEmail: { type: String, index: true }
}, { timestamps: true });

module.exports = mongoose.model("BankingFraud", bankingFraudSchema);
