import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "../config";
import ChatWidget from "../components/ChatWidget";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Shield,
	Edit3,
	Save,
	X,
	Camera,
	FileText,
	Clock,
	CheckCircle,
	AlertCircle,
	LogOut,
	ArrowLeft,
    CreditCard,
    Key,
    Smartphone,
    Award
} from "lucide-react";

const Profile = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("overview");
	const [userInfo, setUserInfo] = useState({
		name: "Verified Citizen",
		email: "",
		phone: "Not provided",
		aadhaar: "XXXX-XXXX-XXXX",
		dob: "Not provided",
	});

	useEffect(() => {
		const sessionData = JSON.parse(localStorage.getItem("govsec_user"));
		if (!sessionData) {
            toast.warning("Secure Session Required. Redirecting...");
            navigate("/signin");
            return;
        }

        const user = sessionData.user || sessionData;
            
        // Initial load from session
        setUserInfo(prev => ({
            ...prev,
            name: `${user.firstname} ${user.lastname}` || "Verified Citizen",
            email: user.email,
            phone: user.phonenumber || "Not provided",
        }));

            // Fetch live data from server to ensure fresh data (fixes missing phone issue)
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`${API_BASE}/auth/profile/${user.email}`);
                    if (response.data.success) {
                        const freshUser = response.data.data;
                        setUserInfo(prev => ({
                            ...prev,
                            name: `${freshUser.firstname} ${freshUser.lastname}`,
                            phone: freshUser.phonenumber || "Not provided",
                        }));
                        
                        // Sync back to session storage
                        const updatedSession = { ...sessionData };
                        if (updatedSession.user) {
                            updatedSession.user.phonenumber = freshUser.phonenumber;
                            updatedSession.user.firstname = freshUser.firstname;
                            updatedSession.user.lastname = freshUser.lastname;
                        } else {
                            updatedSession.phonenumber = freshUser.phonenumber;
                            updatedSession.firstname = freshUser.firstname;
                            updatedSession.lastname = freshUser.lastname;
                        }
                        localStorage.setItem("govsec_user", JSON.stringify(updatedSession));
                    }
                } catch (err) {
                    console.error("Failed to fetch fresh profile:", err);
                }
            };

            fetchProfile();
	}, []);

	const handleLogout = () => {
		localStorage.clear();
		navigate("/signin");
	};

    const handleSave = async () => {
        // Functionality removed as per request to remove editing
    };

	return (
		<div className="min-h-screen bg-[#020617] text-white selection:bg-[#0ed7b2]/30 selection:text-[#0ed7b2] font-sans">
			{/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0ed7b2]/5 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[140px]" />
			</div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                {/* Back Navigation */}
                <Link to="/citizendashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Control Center
                </Link>

                {/* Profile Header Card */}
                <div className="gov-card p-10 mb-8 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ed7b2]/5 rounded-bl-[100px] -z-1 group-hover:bg-[#0ed7b2]/10 transition-all duration-700" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#0ed7b2] to-[#3b82f6] flex items-center justify-center text-4xl font-black text-[#020617] shadow-[0_0_30px_rgba(14,215,178,0.3)]">
                                {userInfo.name.charAt(0)}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-[#020617] border border-white/10 rounded-xl text-[#0ed7b2] hover:scale-110 transition-all shadow-xl">
                                <Camera size={16} />
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight uppercase mb-1">{userInfo.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <Mail size={12} className="text-[#0ed7b2]" />
                                        {userInfo.email}
                                    </span>
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#0ed7b2] uppercase bg-[#0ed7b2]/5 px-3 py-1 rounded-full border border-[#0ed7b2]/10">
                                        <Shield size={12} />
                                        Verified Citizen
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95">
                            <LogOut size={16} />
                            Terminate
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Personal Data */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="gov-card p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Identity Parameters</h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Name</label>
                                    <div className="text-sm font-bold tracking-tight uppercase">{userInfo.name}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered Phone</label>
                                    <div className="text-sm font-bold tracking-tight uppercase">{userInfo.phone}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aadhaar Mapping</label>
                                    <div className="text-sm font-bold tracking-tight uppercase opacity-50">{userInfo.aadhaar}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Biological DOB</label>
                                    <div className="text-sm font-bold tracking-tight uppercase">{userInfo.dob}</div>
                                </div>
                            </div>
                        </div>

                        {/* Security Ledger */}
                        <div className="gov-card p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Security Ledger</h3>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-[#0ed7b2]/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#0ed7b2]">
                                            <Key size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest">Multi-Factor Auth</div>
                                            <div className="text-xs font-bold text-slate-400">Status: Active & Secure</div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-[#0ed7b2] shadow-[0_0_10px_#0ed7b2]" />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#3b82f6]">
                                            <Smartphone size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest">Biometric Link</div>
                                            <div className="text-xs font-bold text-slate-400">Mobile Device ID: SM-G99B</div>
                                        </div>
                                    </div>
                                    <button className="text-[8px] font-black uppercase tracking-widest text-[#3b82f6] border border-[#3b82f6]/30 px-3 py-1 rounded-full hover:bg-[#3b82f6]/10 transition-all">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Platform Metadata */}
                    <div className="space-y-8">
                        <div className="gov-card p-8 bg-[#0ed7b2]/5 border-[#0ed7b2]/20">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 rounded-full border-4 border-[#0ed7b2]/30 flex items-center justify-center p-2">
                                    <div className="w-full h-full rounded-full bg-[#0ed7b2] flex items-center justify-center text-[#020617]">
                                        <Award size={32} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight">Prime Status</h4>
                                    <p className="text-[10px] font-black tracking-widest text-[#0ed7b2] opacity-80 uppercase">Trust Ranking: Tier 1</p>
                                </div>
                                <div className="pt-4 w-full grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-black">12</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Reports</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black">100%</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Credibility</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="gov-card p-8 border-white/5 space-y-6">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Recent Session Logs</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-0.5 bg-[#0ed7b2]/30 rounded-full relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#0ed7b2]" />
                                    </div>
                                    <div className="pb-4">
                                        <div className="text-[10px] font-black uppercase tracking-tighter">Login: Web Terminal</div>
                                        <div className="text-[8px] text-slate-500 font-bold uppercase">2 hours ago • IP: 192.168.1.1</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-0.5 bg-white/5 rounded-full relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700" />
                                    </div>
                                    <div className="pb-4">
                                        <div className="text-[10px] font-black uppercase tracking-tighter">Profile Snapshot</div>
                                        <div className="text-[8px] text-slate-500 font-bold uppercase">Yesterday • System Auto-save</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChatWidget />
		</div>
	);
};

export default Profile;
