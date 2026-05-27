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
		<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617] text-white selection:bg-[#0ed7b2]/30 selection:text-[#0ed7b2] font-sans">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0ed7b2]/5 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[140px]" />
			</div>

			<div className="w-full max-w-[480px] gov-card p-10 animate-pop-in relative z-10 flex flex-col group overflow-hidden">
				<div className="absolute top-0 right-0 w-32 h-32 bg-[#0ed7b2]/5 rounded-bl-[100px] -z-1 group-hover:bg-[#0ed7b2]/10 transition-all duration-700" />
				
				<div className="text-center mb-10">
					<div className="flex justify-center mb-6">
						<div className="gov-logo scale-125 shadow-[0_0_30px_rgba(14,215,178,0.3)]">G</div>
					</div>
					<h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Access Portal</h1>
					<p className="text-[10px] font-black tracking-widest text-[#0ed7b2] uppercase opacity-80">Secure Identification Hub V4.2</p>
				</div>

				{/* User Type Selector */}
				<div className="flex p-1 bg-white/5 rounded-2xl mb-10 border border-white/5">
					<button
						onClick={() => setUserType("citizen")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
							userType === "citizen" ? "bg-[#0ed7b2] text-[#020617] font-black shadow-lg" : "text-slate-500 font-bold hover:text-white"
						}`}
					>
						<User size={16} />
						<span className="text-[10px] uppercase tracking-widest">Citizen</span>
					</button>
					<button
						onClick={() => setUserType("admin")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
							userType === "admin" ? "bg-[#3b82f6] text-white font-black shadow-lg" : "text-slate-500 font-bold hover:text-white"
						}`}
					>
						<Building size={16} />
						<span className="text-[10px] uppercase tracking-widest">Official</span>
					</button>
				</div>

				<div className="space-y-8">
					<div className="space-y-2">
						<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Vector (Email)</label>
						<div className="relative">
							<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all"
								placeholder="Enter registered email"
							/>
						</div>
						{errors.email && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-2 ml-1">{errors.email}</p>}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between mb-1 ml-1">
							<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Key</label>
							<Link to="/forgot-password text-[10px] font-black text-[#0ed7b2] uppercase hover:underline">Recovery</Link>
						</div>
						<div className="relative">
							<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-all"
								placeholder="Enter access code"
							/>
							<button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.password && <p className="text-[#ef4444] text-[10px] font-black uppercase mt-2 ml-1">{errors.password}</p>}
					</div>

					<button
						onClick={handleSubmit}
						disabled={isLoading}
						className="w-full bg-[#0ed7b2] text-[#020617] font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(14,215,178,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" />
						) : (
							<>
								<Shield size={18} />
								Establish Link
							</>
						)}
					</button>

					<p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mt-8">
						New Node Initialization?{" "}
						<Link to="/register" className="text-[#0ed7b2] hover:underline">Registration</Link>
					</p>
				</div>

				<div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
						<ArrowLeft size={16} />
						Exit Terminal
					</Link>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-[#0ed7b2] animate-pulse" />
						<span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Encrypted Session</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
