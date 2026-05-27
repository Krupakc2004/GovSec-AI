const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const response = require("../utils/responseHandler.util.js");
const { sendOtp } = require("../utils/emailHelper.js");

const User = require("../models/user.model.js");

class AuthController {
	static async register(req, res) {
		console.log(req.body);
		const { firstname, lastname, email, password, phonenumber, city, state } =
			req.body;
		if (
			!firstname ||
			!lastname ||
			!email ||
			!password ||
			!phonenumber ||
			!city ||
			!state
		) {
			return response(res, 400, null, "Invalid Fields");
		}
		const user = await User.findOne({ email: email });
		if (user) {
			return response(res, 400, null, "User already existed");
		}

		const otp = Math.floor(1000 + Math.random() * 9000);
		const optExpire = new Date(Date.now() + 5 * 60 * 1000);

		const newuser = new User({
			firstname: firstname,
			lastname: lastname,
			email: email,
			password: password,
			phonenumber: phonenumber,
			city: city,
			state: state,
			otp: otp,
			otpExpire: optExpire,
		});
		await newuser.save();

		await sendOtp(email, otp);

		return response(res, 200, null, "User created sucessfully");
	}

	static async verfiyUser(req, res) {
		const { email, otp } = req.body;
		if (!email || !otp) {
			return response(res, 400, null, "Not found email || Otp");
		}
		const user = await User.findOne({ email });

		if (!user) {
			return response(res, 404, null, "User Not Found ");
		}

		const currentTime = new Date(Date.now());
		if (currentTime > user.otpExpire) {
			return response(res, 400, null, "Otp Expire");
		}
		if (parseInt(user.otp) !== parseInt(otp)) {
			return response(res, 400, null, "Fake Otp");
		}

		user.isVerified = true;
		user.otp = null;
		user.otpExpire = null;

		await user.save();

		return response(res, 200, user, "User verfied Successfully");
	}

	static async login(req, res) {
		try {
			const { email, password } = req.body;

			// Validate fields
			if (!email || !password) {
				return response(res, 400, null, "Email and password are required");
			}

			// Find user by email
			const user = await User.findOne({ email: email.toLowerCase() });
			if (!user) {
				return response(res, 404, null, "User not found");
			}

			// Check if user is verified
			if (!user.isVerified) {
				return response(
					res,
					403,
					null,
					"Account not verified. Please verify your email first."
				);
			}

			// Compare password
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return response(res, 401, null, "Invalid password");
			}

			// Generate JWT token
			const token = jwt.sign(
				{
					userId: user._id,
					email: user.email,
					role: user.role,
					firstname: user.firstname,
					lastname: user.lastname,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "24h" }
			);

			// Return token and user data
			const userData = {
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				role: user.role,
				city: user.city,
				state: user.state,
                phonenumber: user.phonenumber,
                address: user.address,
			};

			return response(res, 200, { token, user: userData }, "Login successful");
		} catch (error) {
			console.error("Login error:", error);
			return response(res, 500, null, "Internal server error");
		}
	}

	static async logout(req, res) {
		// JWT is stateless — client clears sessionStorage
		return response(res, 200, null, "Logged out successfully");
	}

    static async updateProfile(req, res) {
        try {
            const { email, address } = req.body;
            if (!email) {
                return response(res, 400, null, "Email is required");
            }

            const user = await User.findOneAndUpdate(
                { email: email.toLowerCase() },
                { address: address },
                { new: true }
            );

            if (!user) {
                return response(res, 404, null, "User not found");
            }

            const updatedUser = {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                city: user.city,
                state: user.state,
                phonenumber: user.phonenumber,
                address: user.address,
            };

            return response(res, 200, updatedUser, "Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            return response(res, 500, null, "Internal server error");
        }
    }

    static async getProfile(req, res) {
        try {
            const { email } = req.params;
            if (!email) {
                return response(res, 400, null, "Email is required");
            }

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return response(res, 404, null, "User not found");
            }

            const userData = {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                city: user.city,
                state: user.state,
                phonenumber: user.phonenumber,
                address: user.address,
            };

            return response(res, 200, userData, "Profile fetched successfully");
        } catch (error) {
            console.error("Get profile error:", error);
            return response(res, 500, null, "Internal server error");
        }
    }
}

module.exports = AuthController;
