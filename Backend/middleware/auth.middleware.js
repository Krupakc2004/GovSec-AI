const jwt = require("jsonwebtoken");
const response = require("../utils/responseHandler.util.js");

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return response(res, 401, null, "Access denied. No token provided.");
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return response(res, 401, null, "Invalid or expired token.");
	}
};

const govOnly = (req, res, next) => {
	if (req.user && req.user.role === "gov") {
		next();
	} else {
		return response(res, 403, null, "Access denied. Government officials only.");
	}
};

module.exports = { authMiddleware, govOnly };
