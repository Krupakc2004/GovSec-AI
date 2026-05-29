import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
	Shield,
	User,
	Eye,
	EyeOff,
	Mail,
	Phone,
	MapPin,
	ArrowLeft,
} from "lucide-react";

import { API_BASE } from "../config";

const Register = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		city: "",
		state: "",
		agreeTerms: false,
	});
	const [errors, setErrors] = useState({});

	const states = [
		"Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
		"Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
		"Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
		"Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
		"Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
	];

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));

		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
		if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		if (!formData.city.trim()) newErrors.city = "City is required";
		if (!formData.state) newErrors.state = "State is required";
		if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (validateForm()) {
			try {
				await axios.post(`${API_BASE}/auth/register`, {
					firstname: formData.firstName,
					lastname: formData.lastName,
					email: formData.email,
					password: formData.password,
					phonenumber: formData.phone,
					city: formData.city,
					state: formData.state,
				});

				sessionStorage.setItem("govsec_otp_email", formData.email);
				toast.success("Registration successful! Please verify your email.");
				navigate("/otp");
			} catch (error) {
				const msg = error.response?.data?.message || "Registration failed.";
				toast.error(msg);
			}
		}
	};

	return (
		<div className="min-h-screen relative overflow-x-hidden bg-[var(--bg-dark)] text-[var(--text-main)] selection:bg-[var(--primary)] selection:text-white font-sans">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary-dim)] rounded-full blur-[100px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary-dim)] rounded-full blur-[100px]" />
			</div>

			<header className="relative z-10 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto">
				<Link to="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors font-semibold text-sm">
					<ArrowLeft size={16} />
					Back to Home
				</Link>
				<div className="flex items-center gap-3">
					<div className="gov-logo">G</div>
					<span className="text-xl font-bold tracking-tight text-[var(--text-main)]">GovSecAI</span>
				</div>
			</header>

			<main className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-[640px] gov-card p-12 animate-pop-in relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-dim)] rounded-bl-[100px] -z-1 group-hover:scale-110 transition-transform duration-700" />
					
					<div className="text-center mb-12">
						<h1 className="text-3xl font-bold tracking-tight mb-2 text-[var(--text-main)]">Create Account</h1>
						<p className="text-sm font-semibold text-[var(--primary)]">Portal Registration Sub-Module V4.2</p>
					</div>

					<form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">First Name</label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
									<input
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.firstName ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
										placeholder="First Name"
									/>
								</div>
								{errors.firstName && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.firstName}</p>}
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Last Name</label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
									<input
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.lastName ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
										placeholder="Last Name"
									/>
								</div>
								{errors.lastName && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.lastName}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Email Address</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
								<input
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
									placeholder="email@example.com"
								/>
							</div>
							{errors.email && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Phone Number</label>
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
								<input
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									className={`w-full bg-white/5 border ${errors.phone ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
									placeholder="10-digit number"
								/>
							</div>
							{errors.phone && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.phone}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Password</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 px-4 pr-12 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
										placeholder="Min 8 characters"
									/>
									<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.password && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.password}</p>}
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Confirm Password</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 px-4 pr-12 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
										placeholder="Match password"
									/>
									<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
										{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.confirmPassword}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">City</label>
								<div className="relative">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
									<input
										name="city"
										value={formData.city}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.city ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
										placeholder="Your City"
									/>
								</div>
								{errors.city && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.city}</p>}
							</div>
							<div className="space-y-2">
								<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">State</label>
								<select
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									className={`w-full bg-[var(--bg-dark)] border ${errors.state ? "border-red-500" : "border-white/10"} rounded-xl py-3.5 px-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all`}
								>
									<option value="">Select State</option>
									{states.map((s) => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
								{errors.state && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.state}</p>}
							</div>
						</div>

						<div className="flex items-start gap-3 ml-1 py-2">
							<input
								type="checkbox"
								id="agreeTerms"
								name="agreeTerms"
								checked={formData.agreeTerms}
								onChange={handleInputChange}
								className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[var(--primary)] focus:ring-[var(--primary)]/30 cursor-pointer"
							/>
							<div className="flex flex-col">
								<label htmlFor="agreeTerms" className="text-sm text-[var(--text-muted)] font-medium cursor-pointer">
									I agree to the <span className="text-[var(--primary)] hover:underline">Terms of Service</span> and <span className="text-[var(--primary)] hover:underline">Privacy Policy</span>.
								</label>
								{errors.agreeTerms && <p className="text-red-500 text-xs font-medium mt-1">{errors.agreeTerms}</p>}
							</div>
						</div>

						<button
							type="button"
							onClick={handleSubmit}
							className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl transition-all shadow-sm hover:bg-blue-600 active:scale-95 text-sm flex items-center justify-center gap-3 group"
						>
							<Shield size={20} />
							Create Account
						</button>

						<p className="text-center text-[var(--text-muted)] text-sm font-medium mt-8">
							Already have an account?{" "}
							<Link to="/signin" className="text-[var(--primary)] font-semibold hover:underline">Sign In</Link>
						</p>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Register;
