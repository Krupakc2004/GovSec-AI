const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		target: {
			type: String,
			required: true,
			trim: true,
		},
		minAge: {
			type: Number,
			default: 0,
		},
		maxAge: {
			type: Number,
			default: 150,
		},
		gender: {
			type: String,
			enum: ["All", "Female", "Male"],
			default: "All",
		},
		description: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			default: "#",
		},
		icon: {
			type: String,
			default: "📋",
		},
	},
	{ timestamps: true }
);

// Text index for search
schemeSchema.index({ name: "text", category: "text", target: "text", description: "text" });

module.exports = mongoose.model("Scheme", schemeSchema);
