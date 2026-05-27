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
		<div className="min-h-screen relative overflow-x-hidden bg-[#020617] text-white selection:bg-[#0ed7b2]/30 selection:text-[#0ed7b2] font-sans">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0ed7b2]/5 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[140px]" />
			</div>

			<header className="relative z-10 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto">
				<Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-[#0ed7b2] transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
					<ArrowLeft size={16} />
					Return to Core
				</Link>
				<div className="flex items-center gap-3">
					<div className="gov-logo">G</div>
					<span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">GovSecAI</span>
				</div>
			</header>

			<main className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
				<div className="w-full max-w-[640px] gov-card p-12 animate-pop-in relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-32 h-32 bg-[#0ed7b2]/5 rounded-bl-[100px] -z-1 group-hover:bg-[#0ed7b2]/10 transition-all duration-700" />
					
					<div className="text-center mb-12">
						<h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Initialize Identity</h1>
						<p className="text-[10px] font-black tracking-widest text-[#0ed7b2] uppercase opacity-80">Portal Registration Sub-Module V4.2</p>
					</div>

					<form className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
									<input
										name="firstName"
										value={formData.firstName}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.firstName ? "border-red-500" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
										placeholder="First Name"
									/>
								</div>
								{errors.firstName && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.firstName}</p>}
							</div>
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
								<div className="relative">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
									<input
										name="lastName"
										value={formData.lastName}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.lastName ? "border-red-500" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
										placeholder="Last Name"
									/>
								</div>
								{errors.lastName && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.lastName}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
								<input
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
									placeholder="email@example.com"
								/>
							</div>
							{errors.email && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.email}</p>}
						</div>

						<div className="space-y-2">
							<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
								<input
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									className={`w-full bg-white/5 border ${errors.phone ? "border-red-500" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
									placeholder="10-digit number"
								/>
							</div>
							{errors.phone && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.phone}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-2xl py-4 px-4 pr-12 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
										placeholder="Min 8 characters"
									/>
									<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.password && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.password}</p>}
							</div>
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Identity</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className={`w-full bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/10"} rounded-2xl py-4 px-4 pr-12 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all`}
										placeholder="Match password"
									/>
									<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
										{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.confirmPassword && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-1 ml-1">{errors.confirmPassword}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City Node</label>
								<div className="relative">
									<MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
									<input
										name="city"
										value={formData.city}
										onChange={handleInputChange}
										className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all"
										placeholder="Your City"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State Registry</label>
								<select
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all"
								>
									<option value="">Select State</option>
									{states.map((s) => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</div>
						</div>

						<div className="flex items-start gap-3 ml-1 py-2">
							<input
								type="checkbox"
								id="agreeTerms"
								name="agreeTerms"
								checked={formData.agreeTerms}
								onChange={handleInputChange}
								className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#0ed7b2] focus:ring-[#0ed7b2]/30"
							/>
							<label htmlFor="agreeTerms" className="text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-tight">
								I authorize the collection of biometric metadata and agree to the <span className="text-[#0ed7b2] cursor-pointer hover:underline">Secure Ledger Protocols</span>.
							</label>
						</div>

						<button
							type="button"
							onClick={handleSubmit}
							className="w-full bg-[#0ed7b2] text-[#020617] font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(14,215,178,0.3)] hover:scale-[1.02] active:scale-95 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
						>
							<Shield size={20} />
							Initialize Secure Account
						</button>

						<p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mt-8">
							Identity already exists?{" "}
							<Link to="/signin" className="text-[#0ed7b2] hover:underline">Access Terminal</Link>
						</p>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Register;
