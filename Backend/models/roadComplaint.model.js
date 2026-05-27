const mongoose = require("mongoose");

const roadComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, index: true },
  dateReported: { type: String },
  city: { type: String, index: true },
  area: { type: String, index: true },
  issueType: { type: String },
  description: { type: String },
  status: { type: String, default: "Pending", index: true },
  priority: { type: String, default: "Medium" },
  latitude: { type: String },
  longitude: { type: String },
  areaStatus: { type: String, default: "Pending" },
  evidenceUrl: { type: String },
  citizenEmail: { type: String, index: true }
}, { timestamps: true });

module.exports = mongoose.model("RoadComplaint", roadComplaintSchema);
