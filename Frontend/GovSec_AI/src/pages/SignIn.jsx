import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
	Shield,
	Eye,
	EyeOff,
	Mail,
	Lock,
	ArrowLeft,
	User,
	Building,
} from "lucide-react";

import { API_BASE } from "../config";

const SignIn = () => {
	const navigate = useNavigate();
	const [userType, setUserType] = useState("citizen");
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
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
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (validateForm()) {
			setIsLoading(true);
			try {
				const res = await axios.post(`${API_BASE}/auth/login`, {
					email: formData.email,
					password: formData.password,
				});

				const { token, user } = res.data.data;
				sessionStorage.setItem("govsec_token", token);
				sessionStorage.setItem("govsec_user", JSON.stringify(user));

				if (userType === "admin" && user.role === "gov") {
					toast.success("Welcome, Government Official!");
					navigate("/admin");
				} else if (userType === "citizen" && user.role === "citizen") {
					toast.success("Welcome back!");
					navigate("/citizendashboard");
				} else {
					sessionStorage.clear();
					toast.error(`Invalid role for selected login type.`);
				}
			} catch (error) {
				const msg = error.response?.data?.message || "Login failed.";
				toast.error(msg);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--bg-dark)] text-[var(--text-main)] selection:bg-[var(--primary)] selection:text-white font-sans">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary-dim)] rounded-full blur-[100px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary-dim)] rounded-full blur-[100px]" />
			</div>

			<div className="w-full max-w-[480px] gov-card p-10 animate-pop-in relative z-10 flex flex-col group overflow-hidden">
				<div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-dim)] rounded-bl-[100px] -z-1 group-hover:scale-110 transition-transform duration-700" />
				
				<div className="text-center mb-10">
					<div className="flex justify-center mb-6">
						<div className="gov-logo scale-125">G</div>
					</div>
					<h1 className="text-3xl font-bold tracking-tight mb-2 text-[var(--text-main)]">Access Portal</h1>
					<p className="text-sm font-semibold text-[var(--primary)]">Secure Identification Hub V4.2</p>
				</div>

				{/* User Type Selector */}
				<div className="flex p-1 bg-white/5 rounded-xl mb-10 border border-white/5">
					<button
						onClick={() => setUserType("citizen")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${
							userType === "citizen" ? "bg-[var(--primary)] text-white font-semibold shadow-sm" : "text-[var(--text-muted)] font-medium hover:text-white"
						}`}
					>
						<User size={16} />
						<span className="text-sm">Citizen</span>
					</button>
					<button
						onClick={() => setUserType("admin")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 ${
							userType === "admin" ? "bg-[var(--primary)] text-white font-semibold shadow-sm" : "text-[var(--text-muted)] font-medium hover:text-white"
						}`}
					>
						<Building size={16} />
						<span className="text-sm">Official</span>
					</button>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Email Address</label>
						<div className="relative">
							<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all"
								placeholder="Enter registered email"
							/>
						</div>
						{errors.email && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.email}</p>}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between mb-1 ml-1">
							<label className="text-sm font-semibold text-[var(--text-muted)]">Password</label>
							<Link to="/forgot-password" className="text-sm font-semibold text-[var(--primary)] hover:underline">Recovery</Link>
						</div>
						<div className="relative">
							<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-sm font-medium text-white focus:outline-none focus:border-[var(--primary)] transition-all"
								placeholder="Enter password"
							/>
							<button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.password && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{errors.password}</p>}
					</div>

					<button
						onClick={handleSubmit}
						disabled={isLoading}
						className="w-full bg-[var(--primary)] text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:bg-blue-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							<>
								<Shield size={18} />
								Sign In
							</>
						)}
					</button>

					<p className="text-center text-[var(--text-muted)] text-sm font-medium mt-8">
						Don't have an account?{" "}
						<Link to="/register" className="text-[var(--primary)] font-semibold hover:underline">Register here</Link>
					</p>
				</div>

				<div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors text-xs font-semibold">
						<ArrowLeft size={16} />
						Back to Home
					</Link>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
						<span className="text-xs text-[var(--text-muted)] font-medium">Encrypted Session</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
