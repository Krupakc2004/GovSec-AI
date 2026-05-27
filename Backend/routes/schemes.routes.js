const express = require("express");
const router = express.Router();
const {
	getAllSchemes,
	createScheme,
	updateScheme,
	deleteScheme,
	aiRecommend,
} = require("../controllers/schemes.controller");

// Public routes
router.get("/", getAllSchemes);
router.post("/ai-recommend", aiRecommend);

// Admin CRUD routes
router.post("/", createScheme);
router.put("/:id", updateScheme);
router.delete("/:id", deleteScheme);

module.exports = router;
