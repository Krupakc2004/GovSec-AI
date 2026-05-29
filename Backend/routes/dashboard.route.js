const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../static/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueId = "C-" + Math.floor(Math.random() * 1000000);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueId}${ext}`);
    }
});

const upload = multer({ storage });

const DashboardController = require("../controllers/dashboard.controller.js");
const router = express.Router();

// Ping
router.get("/ping", DashboardController.ping);

// Stats (home overview)
router.get("/stats", DashboardController.getStats);
router.get("/locations", DashboardController.getLocations);

// Road
router.get("/road/summary", DashboardController.getRoadSummary);
router.get("/road/areas/:city", DashboardController.getRoadAreas);
router.get("/road/list/:city/:area", DashboardController.getRoadList);

// Health
router.get("/health/summary", DashboardController.getHealthSummary);
router.get("/health/areas/:city", DashboardController.getHealthAreas);
router.get("/health/list/:city/:area", DashboardController.getHealthList);

// Fraud
router.get("/fraud/summary", DashboardController.getFraudSummary);
router.get("/fraud/areas/:city", DashboardController.getFraudAreas);
router.get("/fraud/list/:city/:area", DashboardController.getFraudList);

// Area status (generic for all modules)
router.get("/:module/recent", DashboardController.getRecentModuleComplaints);
router.get("/:module/area-status/:city/:area", DashboardController.getAreaStatus);
router.post("/:module/area-status/:city/:area", DashboardController.updateAreaStatus);
router.post("/:module/area-resolve/:city/:area", DashboardController.resolveArea);

// Track complaint by ID
router.get("/track/:complaint_id", DashboardController.trackComplaint);

// Citizen specific
router.get("/citizen/:email", DashboardController.getCitizenComplaints);
router.post("/complaint", upload.single("evidence"), DashboardController.fileComplaint);
router.post("/complaint/:id/resolve", DashboardController.resolveComplaint);

module.exports = router;
