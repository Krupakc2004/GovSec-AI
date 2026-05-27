const mongoose = require("mongoose");

const healthComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, index: true },
  patientId: { type: String },
  dateReported: { type: String },
  city: { type: String, index: true },
  area: { type: String, index: true },
  facility: { type: String },
  category: { type: String },
  severity: { type: String },
  complaintText: { type: String },
  areaStatus: { type: String, default: "Pending" },
  evidenceUrl: { type: String },
  citizenEmail: { type: String, index: true },
  status: { type: String, default: "Pending", index: true }
}, { timestamps: true });

module.exports = mongoose.model("HealthComplaint", healthComplaintSchema);
