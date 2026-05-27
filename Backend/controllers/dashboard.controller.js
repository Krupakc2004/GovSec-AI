const response = require("../utils/responseHandler.util.js");
const RoadComplaint = require("../models/roadComplaint.model.js");
const HealthComplaint = require("../models/healthComplaint.model.js");
const BankingFraud = require("../models/bankingFraud.model.js");

class DashboardController {
	// --- STATS ---
	static async getStats(req, res) {
		try {
			const roadCount = await RoadComplaint.countDocuments({ status: { $ne: "Resolved" } });
			const healthCount = await HealthComplaint.countDocuments({ status: { $ne: "Resolved" } });
			const fraudCount = await BankingFraud.countDocuments({ status: { $ne: "Resolved" } });

			const counts = {
				road: roadCount,
				health: healthCount,
				fraud: fraudCount,
				total: roadCount + healthCount + fraudCount,
			};

			// Trends (distributed simulation like original)
			const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
			const rFactors = [0.15, 0.17, 0.16, 0.18, 0.16, 0.18];
			const hFactors = [0.16, 0.15, 0.18, 0.17, 0.16, 0.18];
			const fFactors = [0.17, 0.16, 0.15, 0.16, 0.18, 0.18];

			const rData = rFactors.map((f) => Math.floor(roadCount * f));
			const hData = hFactors.map((f) => Math.floor(healthCount * f));
			const fData = fFactors.map((f) => Math.floor(fraudCount * f));
			const totalData = rData.map((r, i) => r + hData[i] + fData[i]);

			// Alerts
			const alerts = [];

			const latestRoads = await RoadComplaint.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(10);
			latestRoads.forEach((r) => {
				alerts.push({
					source: "Road",
					date: r.dateReported,
					sort_date: parseDateForSort(r.dateReported),
					description: r.description,
					city: r.city,
					area: r.area,
					id: r.complaintId,
					evidence_url: r.evidenceUrl || null,
				});
			});

			const latestHealth = await HealthComplaint.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(10);
			latestHealth.forEach((h) => {
				alerts.push({
					source: "Health",
					date: h.dateReported,
					sort_date: parseDateForSort(h.dateReported),
					description: h.complaintText,
					city: h.city,
					area: h.area,
					id: h.complaintId,
					evidence_url: h.evidenceUrl || null,
				});
			});

			const latestFraud = await BankingFraud.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(10);
			latestFraud.forEach((f) => {
				alerts.push({
					source: "Fraud",
					date: f.timestamp ? String(f.timestamp).substring(0, 10) : "",
					sort_date: f.timestamp || "",
					description: f.merchantCategory,
					city: f.locationCity,
					area: f.area,
					id: f.transactionId,
				});
			});

			alerts.sort((a, b) => String(b.sort_date || "").localeCompare(String(a.sort_date || "")));
			const finalAlerts = alerts.slice(0, 10);

			return res.json({
				counts,
				trends: {
					labels,
					road: rData,
					health: hData,
					fraud: fData,
					total: totalData,
				},
				alerts: finalAlerts,
			});
		} catch (error) {
			console.error("Stats error:", error);
			return response(res, 500, null, "Error fetching stats");
		}
	}

	// --- LOCATIONS ---
	static async getLocations(req, res) {
		try {
			const roadRows = await RoadComplaint.aggregate([
                { $match: { city: { $exists: true, $ne: null }, area: { $exists: true, $ne: null } } },
                { $group: { _id: { city: "$city", area: "$area" } } }
            ]);
            const healthRows = await HealthComplaint.aggregate([
                { $match: { city: { $exists: true, $ne: null }, area: { $exists: true, $ne: null } } },
                { $group: { _id: { city: "$city", area: "$area" } } }
            ]);
            const fraudRows = await BankingFraud.aggregate([
                { $match: { locationCity: { $exists: true, $ne: null }, area: { $exists: true, $ne: null } } },
                { $group: { _id: { city: "$locationCity", area: "$area" } } }
            ]);

			const allObj = {};
			
			[...roadRows, ...healthRows, ...fraudRows].forEach(row => {
				const cName = row._id.city ? String(row._id.city).trim() : "";
				const aName = row._id.area ? String(row._id.area).trim() : "";
				if (!cName || !aName) return;
				
				if (!allObj[cName]) allObj[cName] = new Set();
				allObj[cName].add(aName);
			});

			const locations = {};
			Object.keys(allObj).forEach(c => {
				locations[c] = Array.from(allObj[c]).sort();
			});

			return res.json(locations);
		} catch (error) {
			console.error("Locations error:", error);
			return response(res, 500, null, "Error fetching locations");
		}
	}

	// --- ROAD ---
	static async getRoadSummary(req, res) {
		try {
			const rows = await RoadComplaint.aggregate([
                { $match: { status: { $ne: "Resolved" } } },
                { $group: { _id: "$city", count: { $sum: 1 } } }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ complaints_by_city: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getRoadAreas(req, res) {
		try {
			const { city } = req.params;
			const rows = await RoadComplaint.aggregate([
                { $match: { city: { $regex: new RegExp("^" + city + "$", "i") }, status: { $ne: "Resolved" } } },
                { $group: { _id: "$area", count: { $sum: 1 } } },
                { $limit: 15 }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ area_counts: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getRoadList(req, res) {
		try {
			const { city, area } = req.params;
			const rows = await RoadComplaint.find({
                city: { $regex: new RegExp("^" + city + "$", "i") },
                area: { $regex: new RegExp("^" + area + "$", "i") },
                status: { $ne: "Resolved" }
            }).lean();

			return res.json(rows.map(r => ({ ...r, date_reported: r.dateReported, area_status: r.areaStatus, evidence_url: r.evidenceUrl, complaint_id: r.complaintId })));
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getRecentModuleComplaints(req, res) {
		try {
			const { module } = req.params;
			let rows = [];
            if (module === "road") {
                rows = await RoadComplaint.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(50).lean();
                rows = rows.map(r => ({ ...r, date_reported: r.dateReported, area_status: r.areaStatus, evidence_url: r.evidenceUrl, complaint_id: r.complaintId, id: r._id }));
            } else if (module === "health") {
                rows = await HealthComplaint.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(50).lean();
                rows = rows.map(r => ({ ...r, date_reported: r.dateReported, area_status: r.areaStatus, evidence_url: r.evidenceUrl, complaint_id: r.complaintId, id: r._id }));
            } else if (module === "fraud") {
                rows = await BankingFraud.find({ status: { $ne: "Resolved" } }).sort({ _id: -1 }).limit(50).lean();
                rows = rows.map(r => ({ ...r, area_status: r.areaStatus, evidence_url: r.evidenceUrl, transaction_id: r.transactionId, location_city: r.locationCity, id: r._id }));
            } else {
                return response(res, 400, null, "Invalid module");
            }
			
			return res.json(rows);
		} catch (e) {
			console.error("Recent complaints error:", e);
			return response(res, 500, null, "Error");
		}
	}

	// --- HEALTH ---
	static async getHealthSummary(req, res) {
		try {
            const rows = await HealthComplaint.aggregate([
                { $match: { status: { $ne: "Resolved" } } },
                { $group: { _id: "$city", count: { $sum: 1 } } }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ complaints_by_city: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getHealthAreas(req, res) {
		try {
			const { city } = req.params;
			const rows = await HealthComplaint.aggregate([
                { $match: { city: { $regex: new RegExp("^" + city + "$", "i") }, status: { $ne: "Resolved" } } },
                { $group: { _id: "$area", count: { $sum: 1 } } },
                { $limit: 15 }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ area_counts: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getHealthList(req, res) {
		try {
			const { city, area } = req.params;
			const rows = await HealthComplaint.find({
                city: { $regex: new RegExp("^" + city + "$", "i") },
                area: { $regex: new RegExp("^" + area + "$", "i") },
                status: { $ne: "Resolved" }
            }).lean();

			return res.json(rows.map(r => ({ ...r, date_reported: r.dateReported, area_status: r.areaStatus, evidence_url: r.evidenceUrl, complaint_id: r.complaintId })));
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	// --- FRAUD ---
	static async getFraudSummary(req, res) {
		try {
			const rows = await BankingFraud.aggregate([
                { $match: { status: { $ne: "Resolved" } } },
                { $group: { _id: "$locationCity", count: { $sum: 1 } } }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ fraud_by_city: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getFraudAreas(req, res) {
		try {
			const { city } = req.params;
			const rows = await BankingFraud.aggregate([
                { $match: { locationCity: { $regex: new RegExp("^" + city + "$", "i") }, status: { $ne: "Resolved" } } },
                { $group: { _id: "$area", count: { $sum: 1 } } },
                { $limit: 15 }
            ]);
			const result = {};
			rows.forEach((r) => { if(r._id) result[r._id] = r.count; });
			return res.json({ area_counts: result });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async getFraudList(req, res) {
		try {
			const { city, area } = req.params;
			const rows = await BankingFraud.find({
                locationCity: { $regex: new RegExp("^" + city + "$", "i") },
                area: { $regex: new RegExp("^" + area + "$", "i") },
                status: { $ne: "Resolved" }
            }).lean();

			return res.json(rows.map(r => ({ ...r, area_status: r.areaStatus, evidence_url: r.evidenceUrl, location_city: r.locationCity, transaction_id: r.transactionId })));
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	// --- GENERIC AREA STATUS (works for all modules) ---
	static async getAreaStatus(req, res) {
		try {
			const { module, city, area } = req.params;
            let row = null;
            if (module === "road") {
                row = await RoadComplaint.findOne({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else if (module === "health") {
                row = await HealthComplaint.findOne({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else if (module === "fraud") {
                row = await BankingFraud.findOne({ locationCity: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else {
                return response(res, 400, null, "Invalid module");
            }
			
			return res.json({ status: row ? row.areaStatus : "Pending" });
		} catch (e) {
			return response(res, 500, null, "Error");
		}
	}

	static async updateAreaStatus(req, res) {
		try {
			const { module, city, area } = req.params;
			const { status } = req.body;
			if (module === "road") {
                await RoadComplaint.updateMany({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } }, { $set: { areaStatus: status } });
            } else if (module === "health") {
                await HealthComplaint.updateMany({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } }, { $set: { areaStatus: status } });
            } else if (module === "fraud") {
                await BankingFraud.updateMany({ locationCity: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } }, { $set: { areaStatus: status } });
            } else {
                return response(res, 400, null, "Invalid module");
            }
			return res.json({ status: "updated" });
		} catch (e) {
			return response(res, 500, null, "Error updating status");
		}
	}

	static async resolveArea(req, res) {
		try {
			const { module, city, area } = req.params;
			let result = { deletedCount: 0 };

            if (module === "road") {
                result = await RoadComplaint.deleteMany({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else if (module === "health") {
                result = await HealthComplaint.deleteMany({ city: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else if (module === "fraud") {
                result = await BankingFraud.deleteMany({ locationCity: { $regex: new RegExp("^" + city + "$", "i") }, area: { $regex: new RegExp("^" + area + "$", "i") } });
            } else {
                return response(res, 400, null, "Invalid module");
            }
			
			return res.json({ status: "resolved", removed_count: result.deletedCount });
		} catch (e) {
			return response(res, 500, null, "Error resolving");
		}
	}

	// --- TRACK COMPLAINT ---
	static async trackComplaint(req, res) {
		try {
			const { complaint_id } = req.params;

			const road = await RoadComplaint.findOne({ complaintId: complaint_id }).lean();
			if (road)
				return res.json({
					type: "Road",
					status: road.areaStatus || "pending",
					details: { ...road, date_reported: road.dateReported, area_status: road.areaStatus, evidence_url: road.evidenceUrl },
				});

			const health = await HealthComplaint.findOne({ complaintId: complaint_id }).lean();
			if (health)
				return res.json({
					type: "Health",
					status: health.areaStatus || "pending",
					details: { ...health, date_reported: health.dateReported, area_status: health.areaStatus, evidence_url: health.evidenceUrl },
				});

			const fraud = await BankingFraud.findOne({ transactionId: complaint_id }).lean();
			if (fraud)
				return res.json({
					type: "Banking",
					status: fraud.areaStatus || "pending",
					details: { ...fraud, area_status: fraud.areaStatus, evidence_url: fraud.evidenceUrl, location_city: fraud.locationCity },
				});

			return response(res, 404, null, "Complaint ID not found");
		} catch (e) {
			return response(res, 500, null, "Error tracking complaint");
		}
	}

	// --- CITIZEN SPECIFIC ---
	static async getCitizenComplaints(req, res) {
		try {
			const { email } = req.params;
			if (!email) return response(res, 400, null, "Email is required");

			const road = await RoadComplaint.find({ citizenEmail: email }).lean();
			const health = await HealthComplaint.find({ citizenEmail: email }).lean();
			const fraud = await BankingFraud.find({ citizenEmail: email }).lean();

            const roadMap = road.map(r => ({ ...r, source: "Road", date_reported: r.dateReported }));
            const healthMap = health.map(h => ({ ...h, source: "Health", date_reported: h.dateReported }));
            const fraudMap = fraud.map(f => ({ ...f, source: "Fraud" }));

			const all = [...roadMap, ...healthMap, ...fraudMap].sort((a, b) => {
				const dateA = a.date_reported || a.timestamp || "";
				const dateB = b.date_reported || b.timestamp || "";
				return String(dateB).localeCompare(String(dateA));
			});

			// Map to frontend expectations
			const formatted = all.map(c => ({
				id: c.complaintId || c.transactionId,
				type: c.source === "Road" ? "road" : c.source === "Health" ? "health" : "banking",
				title: c.description || c.complaintText || c.merchantCategory || "No description",
				location: `${c.area || ''}, ${c.city || c.locationCity || ''}`.replace(/^, | , $/g, ''),
				priority: c.priority || c.severity || "Medium",
				status: c.status || "Pending",
				date: c.date_reported || c.timestamp
			}));

			return response(res, 200, { complaints: formatted }, "Complaints fetched");
		} catch (e) {
			console.error("Error fetching citizen complaints:", e);
			return response(res, 500, null, "Error fetching complaints");
		}
	}

	static async fileComplaint(req, res) {
		try {
			const { module, city, area, description, citizen_email, evidence_url } = req.body;
			if (!module || !city || !area || !description || !citizen_email) {
				return response(res, 400, null, "Missing required fields");
			}

			const date = new Date().toLocaleDateString("en-GB").replace(/\//g, "-"); // DD-MM-YYYY
			const id = "C-" + Math.floor(Math.random() * 1000000);

			if (module === "road") {
                const doc = new RoadComplaint({
                    complaintId: id, dateReported: date, city, area, description, 
                    status: "Pending", priority: "Medium", areaStatus: "Pending", 
                    citizenEmail: citizen_email, evidenceUrl: evidence_url || null
                });
                await doc.save();
			} else if (module === "health") {
				const doc = new HealthComplaint({
                    complaintId: id, dateReported: date, city, area, complaintText: description, 
                    category: "General", severity: "Medium", status: "Pending", areaStatus: "Pending", 
                    citizenEmail: citizen_email, evidenceUrl: evidence_url || null
                });
                await doc.save();
			} else if (module === "fraud" || module === "banking") {
				const doc = new BankingFraud({
                    transactionId: id, timestamp: new Date().toISOString(), locationCity: city, area, 
                    merchantCategory: description, riskScore: 50, isFraud: "Yes", status: "Pending", 
                    areaStatus: "Pending", citizenEmail: citizen_email, evidenceUrl: evidence_url || null
                });
                await doc.save();
			} else {
				return response(res, 400, null, "Invalid module");
			}

			return res.json({ status: "success", complaint_id: id });
		} catch (e) {
			console.error("Error filing complaint:", e);
			return response(res, 500, null, "Error filing complaint");
		}
	}

	static async resolveComplaint(req, res) {
		try {
			const { id } = req.params;

			const road = await RoadComplaint.findOneAndUpdate({ complaintId: id }, { status: "Resolved" });
			if (road) return response(res, 200, null, "Complaint resolved");

			const health = await HealthComplaint.findOneAndUpdate({ complaintId: id }, { status: "Resolved" });
			if (health) return response(res, 200, null, "Complaint resolved");

			const fraud = await BankingFraud.findOneAndUpdate({ transactionId: id }, { status: "Resolved" });
			if (fraud) return response(res, 200, null, "Complaint resolved");

			return response(res, 404, null, "Complaint not found");
		} catch (e) {
			console.error("Error resolving complaint:", e);
			return response(res, 500, null, "Error resolving complaint");
		}
	}

	// --- PING ---
	static async ping(req, res) {
		return res.json({ status: "ok" });
	}
}

// Helper to normalize dates for sorting
function parseDateForSort(dateStr) {
	if (!dateStr) return "0000-00-00";
	try {
		if (dateStr.includes("T")) return dateStr;
		const parts = String(dateStr).split("-");
		if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
		return dateStr;
	} catch {
		return "0000-00-00";
	}
}

module.exports = DashboardController;
