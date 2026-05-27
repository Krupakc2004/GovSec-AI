const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
		trim: true,
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
	},
	phonenumber: {
		type: Number,
		required: true,
		trim: true,
	},
	city: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
    address: {
        type: String,
        default: "Not provided"
    },
	role: {
		type: String,
		enum: ["citizen", "gov"],
		default: "citizen",
	},
	otp:{
		type: Number,
	},
	isVerified:{
		type: Boolean,
		default: false,
	},
	otpExpire:{
		type:Date,

	}
});

userSchema.pre("save", async function(next){
	try {
		if (!this.isModified("password")) return next();

		const salt = await bcrypt.genSalt(12);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("User", userSchema);
