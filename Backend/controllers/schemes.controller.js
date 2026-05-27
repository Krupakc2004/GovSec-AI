const Scheme = require("../models/scheme.model");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── GET ALL SCHEMES ────────────────────────────────────────────
const getAllSchemes = async (req, res) => {
	try {
		const { search, category } = req.query;
		const filter = {};

		if (category && category !== "all") {
			filter.category = category;
		}

		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
				{ target: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

		const schemes = await Scheme.find(filter).sort({ name: 1 });
		res.json({ success: true, count: schemes.length, data: schemes });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

// ─── CREATE SCHEME ──────────────────────────────────────────────
const createScheme = async (req, res) => {
	try {
		const scheme = new Scheme(req.body);
		await scheme.save();
		res.status(201).json({ success: true, data: scheme });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// ─── UPDATE SCHEME ──────────────────────────────────────────────
const updateScheme = async (req, res) => {
	try {
		const scheme = await Scheme.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });
		res.json({ success: true, data: scheme });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// ─── DELETE SCHEME ──────────────────────────────────────────────
const deleteScheme = async (req, res) => {
	try {
		const scheme = await Scheme.findByIdAndDelete(req.params.id);
		if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });
		res.json({ success: true, message: "Scheme deleted successfully" });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

// ─── AI RECOMMEND (GROQ) ────────────────────────────────────────
const aiRecommend = async (req, res) => {
	try {
		const { query } = req.body;
		if (!query) return res.status(400).json({ success: false, message: "Query is required" });

		// Fetch all schemes for context
		const schemes = await Scheme.find({}).select("name category target minAge maxAge gender description");
		const schemesContext = schemes
			.map(s => `- **${s.name}** (${s.category}): ${s.description} [Target: ${s.target}, Age: ${s.minAge}-${s.maxAge}, Gender: ${s.gender}]`)
			.join("\n");

		const systemPrompt = `You are a helpful Indian Government Scheme Advisor named GovSec AI. Your job is to help Indian citizens find the most relevant government schemes based on their profile.

Available Government Schemes:
${schemesContext}

Instructions:
- Carefully read the user's profile (age, gender, occupation, income level, location, family situation)
- Recommend 3-5 of the MOST relevant schemes from the list above
- For each scheme, explain WHY it is relevant to the user's specific situation
- Use simple, warm, and encouraging language
- Format your response clearly with scheme names in bold using **scheme name**
- Keep response concise (under 300 words)
- End with a motivating note encouraging them to visit the official website
- Do NOT recommend schemes outside the provided list`;

		const chatCompletion = await groq.chat.completions.create({
			model: "llama-3.3-70b-versatile",
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: query },
			],
			temperature: 0.7,
			max_tokens: 600,
		});

		const response = chatCompletion.choices[0]?.message?.content || "Sorry, I could not generate a response. Please try again.";
		res.json({ success: true, response });
	} catch (err) {
		console.error("Groq AI Error:", err.message);
		res.status(500).json({ success: false, message: "AI service error. Please try again.", response: "⚠️ AI service temporarily unavailable. Please try again in a moment." });
	}
};

module.exports = { getAllSchemes, createScheme, updateScheme, deleteScheme, aiRecommend };
