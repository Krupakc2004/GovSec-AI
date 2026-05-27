import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE } from "../config";

const OTP = () => {
	const navigate = useNavigate();
	const [otp, setOtp] = useState(["", "", "", ""]);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [resendTimer, setResendTimer] = useState(30);
	const [canResend, setCanResend] = useState(false);

	// Create refs for each input field
	const inputRefs = useRef([]);

	// Timer for resend OTP
	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [resendTimer]);

	// Auto-focus first input on mount
	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	// Handle OTP input change
	const handleChange = (index, value) => {
		// Only allow numbers
		if (value && !/^\d$/.test(value)) {
			return;
		}

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);
		setError("");
		setSuccess(false);

		// Auto-focus next input
		if (value && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle backspace/delete
	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace") {
			e.preventDefault();

			const newOtp = [...otp];

			if (otp[index]) {
				// Clear current input
				newOtp[index] = "";
				setOtp(newOtp);
			} else if (index > 0) {
				// Move to previous input and clear it
				newOtp[index - 1] = "";
				setOtp(newOtp);
				inputRefs.current[index - 1].focus();
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1].focus();
		} else if (e.key === "ArrowRight" && index < 3) {
			inputRefs.current[index + 1].focus();
		}
	};

	// Handle paste
	const handlePaste = (e) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData("text").slice(0, 4);

		if (/^\d{4}$/.test(pasteData)) {
			const newOtp = pasteData.split("");
			setOtp(newOtp);
			inputRefs.current[3].focus();
		}
	};

	// Submit OTP
	const handleSubmit = async () => {
		const otpValue = otp.join("");

		if (otpValue.length !== 4) {
			setError("Please enter all 4 digits");
			return;
		}

		setError("");
		setSuccess(false);

		const email = sessionStorage.getItem("govsec_otp_email");
		if (!email) {
			setError("Email not found. Please register again.");
			return;
		}

		try {
			await axios.post(`${API_BASE}/auth/verfiy`, {
				email,
				otp: otpValue,
			});

			setSuccess(true);
			sessionStorage.removeItem("govsec_otp_email");
			toast.success("Email verified successfully!");

			setTimeout(() => {
				navigate("/signin");
			}, 1500);
		} catch (err) {
			const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
			setError(msg);

			// Shake animation
			document.getElementById("otp-container")?.classList.add("shake");
			setTimeout(() => {
				document.getElementById("otp-container")?.classList.remove("shake");
			}, 500);

			// Clear OTP inputs
			setOtp(["", "", "", ""]);
			inputRefs.current[0]?.focus();
		}
	};

	// Resend OTP
	const handleResend = async () => {
		if (!canResend) return;

		try {
			// Replace with your actual API call
			// await fetch('YOUR_API_ENDPOINT/resend-otp', { method: 'POST' })

			setResendTimer(30);
			setCanResend(false);
			setOtp(["", "", "", ""]);
			setError("");
			setSuccess(false);
			inputRefs.current[0].focus();
		} catch (err) {
			setError("Failed to resend OTP. Please try again.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#020617]">
			{/* Background Blobs */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0ed7b2]/10 rounded-full blur-[120px]" />
			<div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-[#3b82f6]/10 rounded-full blur-[120px]" />

			<div className="w-full max-w-[480px] gov-card animate-pop-in relative z-10 text-center">
				<div className="flex justify-center mb-8">
					<div className="gov-logo scale-125">G</div>
				</div>

				<h1 className="gov-h2 mb-2">Verify Identity</h1>
				<p className="gov-muted mb-8 italic">Secure code sent to your registered contact</p>

				<div id="otp-container" className="flex justify-center gap-4 mb-8">
					{otp.map((digit, index) => (
						<input
							key={index}
							ref={(ref) => (inputRefs.current[index] = ref)}
							type="text"
							maxLength="1"
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							className="w-16 h-20 text-3xl font-black text-center bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#0ed7b2] focus:ring-4 focus:ring-[#0ed7b2]/10 transition-all shadow-inner"
						/>
					))}
				</div>

				{error && <p className="text-[#ef4444] text-sm mb-6 font-bold">{error}</p>}
				{success && <p className="text-[#0ed7b2] text-sm mb-6 font-bold">Verification Successful!</p>}

				<button
					onClick={handleSubmit}
					disabled={otp.join("").length !== 4 || success}
					className="w-full bg-[#0ed7b2] hover:bg-[#059669] text-[#020617] font-extrabold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(14,215,178,0.3)] mb-8 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
				>
					{success ? "Identity Verified ✓" : "Initialize Verification"}
				</button>

				<div className="text-sm text-slate-400 mb-8 font-medium">
					{canResend ? (
						<span>
							Didn't receive code?{" "}
							<button onClick={handleResend} className="text-[#0ed7b2] font-bold hover:underline">
								Resend Now
							</button>
						</span>
					) : (
						<span>New security code available in <span className="text-white font-mono">{resendTimer}s</span></span>
					)}
				</div>

				<div className="pt-8 border-t border-white/5">
					<Link to="/signin" className="flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
						<ArrowLeft size={16} />
						Return to Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default OTP;
