import React, { useState, useEffect } from "react";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Shield,
	Building,
	Award,
	Clock,
	FileText,
	Activity,
	LogOut,
	Settings,
	ArrowLeft,
    Briefcase,
    Zap
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AdminProfile = () => {
    const navigate = useNavigate();
	const [adminInfo, setAdminInfo] = useState({
		name: "Gov Official",
		email: "admin@govsecai.gov",
		phone: "+91 XXXXX XXXXX",
		employeeId: "GS-ADM-2024-XXXX",
		department: "Strategic Intelligence",
		designation: "Authorized Officer",
	});

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("govsec_user"));
        if (user) {
            setAdminInfo({
                ...adminInfo,
                name: user.name || user.username || "Gov Official",
                email: user.email,
                designation: user.role === "gov" ? "Strategic Officer" : "Authorized Person"
            });
        }
    }, []);

	const handleLogout = () => {
		sessionStorage.clear();
		navigate("/signin");
	};

	return (
		<div className="min-h-screen bg-[#020617] text-white selection:bg-[#0ed7b2]/30 selection:text-[#0ed7b2] font-sans">
			{/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0ed7b2]/5 rounded-full blur-[140px]" />
			</div>

            <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                {/* Back Navigation */}
                <Link to="/admindashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Command Hub
                </Link>

                {/* Profile Header Card */}
                <div className="gov-card p-10 mb-8 border border-[#3b82f6]/20 relative overflow-hidden group shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#3b82f6]/5 rounded-bl-[120px] -z-1 group-hover:bg-[#3b82f6]/10 transition-all duration-700" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                {adminInfo.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-[#020617] border border-[#3b82f6]/20 rounded-xl text-[#3b82f6] shadow-xl animate-pulse">
                                <Shield size={16} />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight uppercase mb-1">{adminInfo.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        <Mail size={12} className="text-[#3b82f6]" />
                                        {adminInfo.email}
                                    </span>
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#3b82f6] uppercase bg-[#3b82f6]/5 px-3 py-1 rounded-full border border-[#3b82f6]/10">
                                        <Award size={12} />
                                        Senior Government Node
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 text-slate-400 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#ef4444] hover:text-white transition-all active:scale-95 group">
                            <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
                            Session Termination
                        </button>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Official Metadata */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="gov-card p-0 overflow-hidden border-[#3b82f6]/10">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#3b82f6] uppercase">Official Parameters</h3>
                            </div>
                            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee UID</label>
                                    <div className="text-sm font-black tracking-widest text-[#3b82f6] uppercase">{adminInfo.employeeId}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Designation</label>
                                    <div className="text-sm font-bold tracking-tight uppercase text-white">{adminInfo.designation}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategic Department</label>
                                    <div className="text-sm font-bold tracking-tight uppercase text-white">{adminInfo.department}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Clearance Level</label>
                                    <div className="text-sm font-black tracking-widest text-[#0ed7b2] uppercase">Level 4 (Executive)</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Governance Actions */}
                        <div className="gov-card p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Governance History</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                {[
                                    { action: "POLICY_ENACTED", target: "Data Privacy Protocol V2", time: "08:45 AM" },
                                    { action: "COMPLAINT_RESOLVED", target: "CASE_ID_9921_INFRA", time: "Yesterday" },
                                    { action: "NODE_INITIALIZED", target: "District Secretariat Node 4", time: "2 days ago" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:bg-[#3b82f6]/5 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="p-3 bg-white/5 rounded-xl text-[#3b82f6] group-hover:scale-110 transition-transform">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white">{item.action}</div>
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{item.target}</div>
                                            </div>
                                        </div>
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Node Metrics */}
                    <div className="space-y-8">
                        <div className="gov-card p-8 bg-[#3b82f6]/5 border-[#3b82f6]/20 text-center">
                            <div className="inline-flex p-5 rounded-3xl bg-white/5 border border-white/10 mb-6 text-[#3b82f6]">
                                <Zap size={40} fill="currentColor" className="animate-pulse" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-tight mb-2">Officer Rating</h4>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#0ed7b2]">9.8 / 10</div>
                            <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase mt-4 italic">Exemplary Efficiency Detected</p>
                        </div>

                        <div className="gov-card p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Access Terminal</h3>
                            </div>
                            <div className="p-8 space-y-4">
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#3b82f6]/30 transition-all text-left group">
                                    <div className="flex items-center gap-3">
                                        <Settings size={16} className="text-slate-500 group-hover:text-[#3b82f6]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Engine Config</span>
                                    </div>
                                    <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#3b82f6]/30 transition-all text-left group">
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-slate-500 group-hover:text-[#3b82f6]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Encryption Keys</span>
                                    </div>
                                    <ArrowLeft size={14} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	);
};

export default AdminProfile;
