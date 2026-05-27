require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Scheme = require("../models/scheme.model");

const SCHEMES = [
	{ name: "Pradhan Mantri Jan Dhan Yojana", category: "Financial Inclusion", target: "All Citizens", minAge: 0, maxAge: 150, gender: "All", description: "Banking access for unbanked households with zero-balance accounts and financial services.", url: "https://pmjdy.gov.in", icon: "🏦" },
	{ name: "Pradhan Mantri Awas Yojana (Urban)", category: "Housing", target: "Urban Poor", minAge: 18, maxAge: 70, gender: "All", description: "Affordable housing for urban poor with interest subsidy on home loans.", url: "https://pmaymis.gov.in", icon: "🏠" },
	{ name: "Pradhan Mantri Awas Yojana (Gramin)", category: "Housing", target: "Rural Poor", minAge: 18, maxAge: 70, gender: "All", description: "Financial assistance for rural housing for homeless and kutcha house families.", url: "https://pmayg.nic.in", icon: "🏠" },
	{ name: "Ayushman Bharat PM-JAY", category: "Health", target: "Low Income Families", minAge: 0, maxAge: 120, gender: "All", description: "Health insurance cover up to ₹5 lakh per family for secondary and tertiary care hospitalization.", url: "https://pmjay.gov.in", icon: "🏥" },
	{ name: "PM Kisan Samman Nidhi", category: "Agriculture", target: "Farmers", minAge: 18, maxAge: 80, gender: "All", description: "₹6,000 per year direct income support to small and marginal farmers in three installments.", url: "https://pmkisan.gov.in", icon: "🌾" },
	{ name: "Soil Health Card Scheme", category: "Agriculture", target: "Farmers", minAge: 18, maxAge: 80, gender: "All", description: "Soil testing and health cards to farmers with crop-wise nutrient recommendations.", url: "https://soilhealth.dac.gov.in", icon: "🌾" },
	{ name: "Pradhan Mantri Fasal Bima Yojana", category: "Agriculture Insurance", target: "Farmers", minAge: 18, maxAge: 80, gender: "All", description: "Crop insurance scheme providing financial support to farmers suffering crop loss from calamities.", url: "https://pmfby.gov.in", icon: "🛡️" },
	{ name: "National Pension System", category: "Pension", target: "All Citizens", minAge: 18, maxAge: 70, gender: "All", description: "Voluntary, long-term retirement savings scheme with tax benefits for all Indian citizens.", url: "https://npscra.nsdl.co.in", icon: "🧓" },
	{ name: "Atal Pension Yojana", category: "Pension", target: "Unorganized Workers", minAge: 18, maxAge: 40, gender: "All", description: "Guaranteed pension scheme for workers in unorganized sector with government co-contribution.", url: "https://npscra.nsdl.co.in", icon: "🧓" },
	{ name: "PM Shram Yogi Maandhan", category: "Pension", target: "Unorganized Workers", minAge: 18, maxAge: 40, gender: "All", description: "Monthly pension of ₹3,000 after 60 years for unorganized sector workers with ₹15,000 income or below.", url: "https://maandhan.in", icon: "🧓" },
	{ name: "Pradhan Mantri Mudra Yojana", category: "Entrepreneurship", target: "Small Business Owners", minAge: 18, maxAge: 65, gender: "All", description: "Loans up to ₹10 lakh for non-corporate, non-farm small/micro enterprises in three tiers.", url: "https://mudra.org.in", icon: "💼" },
	{ name: "Startup India Initiative", category: "Entrepreneurship", target: "Startups", minAge: 21, maxAge: 50, gender: "All", description: "Tax benefits, funding support and simplified compliance for recognized startups in India.", url: "https://startupindia.gov.in", icon: "💼" },
	{ name: "Stand-Up India Scheme", category: "Entrepreneurship", target: "SC/ST/Women", minAge: 18, maxAge: 65, gender: "Female", description: "Bank loans between ₹10 lakh and ₹1 crore to SC/ST and women entrepreneurs for greenfield enterprise.", url: "https://www.standupmitra.in", icon: "💼" },
	{ name: "Beti Bachao Beti Padhao", category: "Women Empowerment", target: "Girl Child", minAge: 0, maxAge: 18, gender: "Female", description: "Scheme to address declining child sex ratio and promote welfare and education of girl child.", url: "https://wcd.nic.in/bbbp-schemes", icon: "👩" },
	{ name: "Sukanya Samriddhi Yojana", category: "Savings", target: "Girl Child", minAge: 0, maxAge: 10, gender: "Female", description: "High interest savings scheme for girl child to secure her education and marriage expenses.", url: "https://www.india.gov.in/sukanya-samriddhi-yojna", icon: "💰" },
	{ name: "Mahila Shakti Kendra", category: "Women Empowerment", target: "Women", minAge: 18, maxAge: 60, gender: "Female", description: "Empowerment of rural women through community participation and skill development centers.", url: "https://wcd.nic.in", icon: "👩" },
	{ name: "PM Matru Vandana Yojana", category: "Maternal Health", target: "Pregnant Women", minAge: 19, maxAge: 45, gender: "Female", description: "Cash incentive of ₹5,000 for pregnant and lactating mothers for first live birth.", url: "https://pmmvy.nic.in", icon: "🤰" },
	{ name: "Ujjwala Yojana", category: "Energy", target: "BPL Women", minAge: 18, maxAge: 60, gender: "Female", description: "Free LPG connections to women from Below Poverty Line households for clean cooking fuel.", url: "https://pmuy.gov.in", icon: "🔥" },
	{ name: "National Education Policy Schemes", category: "Education", target: "Students", minAge: 5, maxAge: 30, gender: "All", description: "Implementation of NEP 2020 focusing on holistic, flexible, multidisciplinary education.", url: "https://education.gov.in", icon: "📚" },
	{ name: "PM Scholarship Scheme", category: "Education", target: "Students", minAge: 18, maxAge: 25, gender: "All", description: "Scholarships for higher technical and professional education for wards of ex-servicemen.", url: "https://ksb.gov.in/pmss.htm", icon: "📚" },
	{ name: "National Means Cum Merit Scholarship", category: "Education", target: "Economically Weaker Students", minAge: 13, maxAge: 18, gender: "All", description: "Scholarship to meritorious students of economically weaker sections from class 9 to 12.", url: "https://scholarships.gov.in", icon: "📚" },
	{ name: "Mid Day Meal Scheme", category: "Education", target: "School Children", minAge: 5, maxAge: 14, gender: "All", description: "Free lunch to school children in government schools to improve nutrition and enrollment.", url: "https://mdm.nic.in", icon: "📚" },
	{ name: "Skill India Mission", category: "Skill Development", target: "Youth", minAge: 15, maxAge: 35, gender: "All", description: "Training and certification of youth in various vocational skills to enhance employability.", url: "https://skillindia.gov.in", icon: "🎯" },
	{ name: "PM Kaushal Vikas Yojana", category: "Skill Development", target: "Youth", minAge: 15, maxAge: 35, gender: "All", description: "Short-term training and RPL certification with monetary rewards for skill development.", url: "https://pmkvyofficial.org", icon: "🎯" },
	{ name: "National Rural Employment Guarantee", category: "Employment", target: "Rural Households", minAge: 18, maxAge: 80, gender: "All", description: "100 days of guaranteed wage employment to rural households whose adult members volunteer.", url: "https://nrega.nic.in", icon: "💼" },
	{ name: "PM Rozgar Protsahan Yojana", category: "Employment", target: "Employers and New Employees", minAge: 18, maxAge: 35, gender: "All", description: "Government pays employer EPF contribution for new employees to promote formal employment.", url: "https://pmrpy.gov.in", icon: "💼" },
	{ name: "Aadhaar Enabled Payment System", category: "Financial Inclusion", target: "All Citizens", minAge: 18, maxAge: 100, gender: "All", description: "Interoperable financial inclusion platform using Aadhaar authentication for direct benefit transfers.", url: "https://uidai.gov.in", icon: "🏦" },
	{ name: "PM Street Vendor's AtmaNirbhar Nidhi", category: "Financial Inclusion", target: "Street Vendors", minAge: 18, maxAge: 65, gender: "All", description: "Working capital loans up to ₹10,000 for street vendors impacted by COVID-19 pandemic.", url: "https://pmsvanidhi.mohua.gov.in", icon: "🏦" },
	{ name: "Jal Jeevan Mission", category: "Water & Sanitation", target: "Rural Households", minAge: 0, maxAge: 100, gender: "All", description: "Tap water connection to every rural household with functional household tap connections.", url: "https://jaljeevanmission.gov.in", icon: "💧" },
	{ name: "Swachh Bharat Mission", category: "Water & Sanitation", target: "All Citizens", minAge: 0, maxAge: 100, gender: "All", description: "Building individual household toilets and community sanitation facilities across India.", url: "https://swachhbharat.mygov.in", icon: "💧" },
	{ name: "Pradhan Mantri Gram Sadak Yojana", category: "Infrastructure", target: "Rural Communities", minAge: 0, maxAge: 100, gender: "All", description: "All-weather road connectivity to unconnected habitations in rural areas.", url: "https://pmgsy.nic.in", icon: "🛣️" },
	{ name: "Digital India Programme", category: "Digital Services", target: "All Citizens", minAge: 0, maxAge: 100, gender: "All", description: "Transforming India into a digitally empowered society and knowledge economy.", url: "https://digitalindia.gov.in", icon: "📱" },
	{ name: "BharatNet", category: "Digital Services", target: "Rural Citizens", minAge: 0, maxAge: 100, gender: "All", description: "High-speed broadband connectivity to all gram panchayats across India.", url: "https://bbnl.nic.in", icon: "📱" },
	{ name: "PM WANI", category: "Digital Services", target: "All Citizens", minAge: 18, maxAge: 100, gender: "All", description: "Proliferation of broadband through public Wi-Fi hotspots by encouraging local entrepreneurs.", url: "https://dot.gov.in", icon: "📱" },
	{ name: "Ayushman Bharat Digital Mission", category: "Health", target: "All Citizens", minAge: 0, maxAge: 120, gender: "All", description: "Unique health ID for every citizen to maintain digital health records.", url: "https://abdm.gov.in", icon: "🏥" },
	{ name: "National Health Mission", category: "Health", target: "Rural & Urban Poor", minAge: 0, maxAge: 120, gender: "All", description: "Strengthen healthcare delivery and disease control across rural and urban areas.", url: "https://nhm.gov.in", icon: "🏥" },
	{ name: "Jan Aushadhi Scheme", category: "Health", target: "All Citizens", minAge: 0, maxAge: 120, gender: "All", description: "Affordable quality generic medicines through dedicated Jan Aushadhi Kendras.", url: "https://janaushadhi.gov.in", icon: "🏥" },
	{ name: "PM Suraksha Bima Yojana", category: "Insurance", target: "Bank Account Holders", minAge: 18, maxAge: 70, gender: "All", description: "Accidental death and disability insurance cover of ₹2 lakh at ₹12/year premium.", url: "https://financialservices.gov.in", icon: "🛡️" },
	{ name: "PM Jeevan Jyoti Bima Yojana", category: "Insurance", target: "Bank Account Holders", minAge: 18, maxAge: 50, gender: "All", description: "Life insurance of ₹2 lakh at ₹330/year for death due to any reason.", url: "https://financialservices.gov.in", icon: "🛡️" },
	{ name: "Kisan Credit Card", category: "Agriculture", target: "Farmers", minAge: 18, maxAge: 75, gender: "All", description: "Short-term credit requirements of farmers for crops, post-harvest and allied activities.", url: "https://agricoop.nic.in", icon: "🌾" },
	{ name: "e-NAM", category: "Agriculture", target: "Farmers and Traders", minAge: 18, maxAge: 80, gender: "All", description: "Online trading platform for agricultural commodities for better price discovery.", url: "https://enam.gov.in", icon: "🌾" },
	{ name: "National Livelihood Mission", category: "Poverty Alleviation", target: "Rural Poor", minAge: 18, maxAge: 60, gender: "All", description: "Self-employment and skilled wage employment to rural poor through SHGs and livelihood collectives.", url: "https://aajeevika.gov.in", icon: "🤝" },
	{ name: "PMEGP", category: "Entrepreneurship", target: "Unemployed Youth", minAge: 18, maxAge: 35, gender: "All", description: "Credit-linked subsidy programme for generation of employment through micro enterprises.", url: "https://kviconline.gov.in/pmegp", icon: "💼" },
	{ name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana", category: "Skill Development", target: "Rural Youth", minAge: 15, maxAge: 35, gender: "All", description: "Placement-linked skill training for rural youth including those in difficult circumstances.", url: "https://ddugky.gov.in", icon: "🎯" },
	{ name: "PM SVANidhi", category: "Financial Inclusion", target: "Street Vendors", minAge: 18, maxAge: 65, gender: "All", description: "Micro credit for street vendors for working capital with digital payment incentives.", url: "https://pmsvanidhi.mohua.gov.in", icon: "🏦" },
];

async function seed() {
	try {
		await mongoose.connect(process.env.MONGOURL);
		console.log("✅ Connected to MongoDB");

		// Drop existing schemes
		await Scheme.deleteMany({});
		console.log("🗑️  Cleared existing schemes");

		// Insert all
		await Scheme.insertMany(SCHEMES);
		console.log(`🌱 Seeded ${SCHEMES.length} schemes successfully!`);

		await mongoose.disconnect();
		console.log("✅ Done. Disconnected.");
	} catch (err) {
		console.error("❌ Seed failed:", err.message);
		process.exit(1);
	}
}

seed();
