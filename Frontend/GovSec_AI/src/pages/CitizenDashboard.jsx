import axios from "axios";
import {
    Activity,
    AlertCircle,
    BookOpen,
    Bot,
    Construction,
    CreditCard,
    FileWarning,
    LayoutDashboard,
    LogOut,
    Plus,
    Search,
    Settings,
    Shield,
    Stethoscope,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ChatWidget from "../components/ChatWidget";
import SchemesPanel from "../components/SchemesPanel";
import AIAdvisorPanel from "../components/AIAdvisorPanel";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis
} from "recharts";

import { API_BASE } from "../config";

const CitizenDashboard = () => {
    const navigate = useNavigate();
    // State
	const [activeTab, setActiveTab] = useState("overview");
	const [aiInitialMsg, setAiInitialMsg] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [userData, setUserData] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [complaintType, setComplaintType] = useState("road"); // road, health, banking
    const [locations, setLocations] = useState({});
    const [areasForCity, setAreasForCity] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("govsec_theme") || "dark");
    const [newComplaint, setNewComplaint] = useState({
        title: "",
        description: "",
        city: "",
        area: "",
        priority: "Medium"
    });

    // Effect: Load User Data
    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("govsec_user"));
        if (user) {
            setUserData(user);
            fetchComplaints(user.email);
        }
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await axios.get(`${API_BASE}/dashboard/locations`);
            setLocations(res.data);
        } catch (error) {
            console.error("Error loading locations", error);
        }
    };

    const fetchComplaints = async (email) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/dashboard/citizen/${email}`);
            setComplaints(res.data.data.complaints);
        } catch (error) {
            toast.error("Failed to load complaints");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/dashboard/complaint`, {
                module: complaintType, // backend expects 'module'
                citizen_email: userData?.email, // backend expects 'citizen_email'
                ...newComplaint
            });
            toast.success("Complaint filed successfully!");
            setShowComplaintModal(false);
            setNewComplaint({ title: "", description: "", city: "", area: "", priority: "Medium" });
            fetchComplaints(userData.email);
        } catch (error) {
            toast.error("Error filing complaint");
        }
    };

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("govsec_theme", newTheme);
    };

    const logout = () => {
        sessionStorage.clear();
        window.location.href = "/signin";
    };

    // UI Helpers
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === "pending") return "bg-orange-500/10 text-orange-500 border-orange-500/20";
        if (s === "resolved" || s === "completed") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    };

    // Components
    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === id 
                ? "bg-[#0ed7b2] text-[#020617] shadow-[0_0_20px_rgba(14,215,178,0.3)] font-black" 
                : "text-slate-400 hover:bg-white/5 hover:text-white font-bold"
            }`}
        >
            <Icon size={20} className={activeTab === id ? "" : "group-hover:scale-110 transition-transform"} />
            {isSidebarOpen && <span className="text-sm tracking-tight">{label}</span>}
        </button>
    );

    if (!userData) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#0ed7b2] font-black tracking-widest">INITIALIZING SECURE SESSION...</div>;

	return (
		<div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${theme === "light" ? "light-theme" : ""} bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? "w-[280px]" : "w-[90px]"} bg-[var(--bg-sidebar)] border-r border-white/5 flex flex-col p-6 transition-all duration-500 relative z-30 shadow-2xl`}>
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="gov-logo scale-110">G</div>
                    {isSidebarOpen && <span className="text-xl font-extrabold tracking-tighter uppercase tracking-widest text-[var(--text-primary)]">Citizen Node</span>}
                </div>

                <div className="space-y-2 flex-1">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Strategic View" />
                    <SidebarItem id="complaints" icon={FileWarning} label="My Reports" />
                    <SidebarItem id="schemes" icon={BookOpen} label="Gov Schemes" />
                    <SidebarItem id="ai-advisor" icon={Bot} label="AI Advisor" />
                    <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] font-bold group transition-all duration-300"
                    >
                        <User size={20} className="group-hover:scale-110 transition-transform" />
                        {isSidebarOpen && <span className="text-sm tracking-tight">My Profile</span>}
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <SidebarItem id="settings" icon={Settings} label="Setting" />
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[#ef4444] hover:bg-red-500/5 transition-all font-bold group">
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        {isSidebarOpen && <span className="text-sm uppercase tracking-widest font-black">Terminate</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative bg-[var(--bg-primary)]">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary-color)]/5 rounded-full blur-[120px] pointer-events-none" />
                
                {/* Header */}
                <header className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/5 px-8 h-24 flex items-center justify-between">
                    <div>
                        <h2 className="gov-h2 text-2xl mb-1 uppercase tracking-widest font-black" style={{backgroundImage: 'none', WebkitBackgroundClip: 'initial', WebkitTextFillColor: 'var(--text-primary)'}}>
                            {activeTab === "overview" ? "Strategic Intelligence" : activeTab === "complaints" ? "Citizen Complaints" : activeTab === "schemes" ? "Government Schemes" : activeTab === "ai-advisor" ? "AI Policy Advisor" : "Strategic Configuration"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">Secure Link Established: {userData.email}</span>
                        </div>
                    </div>


                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setShowComplaintModal(true)} 
                            className="bg-[#0ed7b2] hover:bg-[#059669] text-[#020617] px-6 py-3 rounded-xl font-black text-sm transition-all shadow-[0_0_20px_rgba(14,215,178,0.2)] flex items-center gap-2 active:scale-95 animate-glow"
                        >
                            <Plus size={18} />
                            NEW REPORT
                        </button>
                    </div>
                </header>

                <div className="p-8 space-y-8 animate-pop-in">
                    {activeTab === "overview" && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="gov-card flex flex-col group hover:border-[#0ed7b2]/30 transition-all cursor-default relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-16 h-16 bg-[#0ed7b2]/5 rounded-bl-full group-hover:bg-[#0ed7b2]/10 transition-all" />
                                    <span className="text-[10px] font-black tracking-widest text-[#0ed7b2] mb-1 uppercase">Total Reports</span>
                                    <div className="text-4xl font-black text-white">{complaints.length}</div>
                                    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden text-[10px] font-bold text-slate-500 py-4 flex items-center">
                                       GLOBAL_INDEX_4.2
                                    </div>
                                </div>
                                <div className="gov-card flex flex-col group hover:border-[#3b82f6]/30 transition-all cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#3b82f6]/5 rounded-bl-full group-hover:bg-[#3b82f6]/10 transition-all" />
                                    <span className="text-[10px] font-black tracking-widest text-[#3b82f6] mb-1 uppercase">In Progress</span>
                                    <div className="text-4xl font-black text-white">{complaints.filter(c => c.status === "Pending" || c.status === "In Progress").length}</div>
                                    <div className="mt-4 text-[10px] font-black tracking-widest text-[#3b82f6]/50 uppercase">Active Monitoring</div>
                                </div>
                                <div className="gov-card flex flex-col group hover:border-emerald-500/30 transition-all cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-all" />
                                    <span className="text-[10px] font-black tracking-widest text-emerald-500 mb-1 uppercase">Resolved</span>
                                    <div className="text-4xl font-black text-white">{complaints.filter(c => c.status === "Resolved" || c.status === "Completed").length}</div>
                                    <div className="mt-4 text-[10px] font-black tracking-widest text-emerald-500/50 uppercase">Compliance Reached</div>
                                </div>
                                <div className="gov-card flex flex-col group hover:border-blue-400/30 transition-all cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-400/5 rounded-bl-full group-hover:bg-blue-400/10 transition-all" />
                                    <span className="text-[10px] font-black tracking-widest text-blue-400 mb-1 uppercase">System Trust</span>
                                    <div className="text-4xl font-black text-white">98%</div>
                                    <div className="mt-4 text-[10px] font-black tracking-widest text-blue-400/50 uppercase">Verified Nodes</div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="gov-card p-0 overflow-hidden h-[400px]">
                                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                        <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Strategic Sentiment Index</h3>
                                    </div>
                                    <div className="p-8 h-full pb-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { month: "Jan", val: 400 }, { month: "Feb", val: 300 }, { month: "Mar", val: 600 },
                                                { month: "Apr", val: 800 }, { month: "May", val: 500 }, { month: "Jun", val: 900 }
                                            ]}>
                                                <XAxis dataKey="month" stroke="#475569" strokeWidth={0} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                                <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                                                <Line type="monotone" dataKey="val" stroke="#0ed7b2" strokeWidth={4} dot={{r: 4, fill: '#0ed7b2', strokeWidth: 0}} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="gov-card p-0 overflow-hidden h-[400px]">
                                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                                        <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Engagement Vectors</h3>
                                    </div>
                                    <div className="p-8 h-full pb-20">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { name: "HEALTH", val: 80 }, { name: "ROAD", val: 65 }, { name: "FINANCE", val: 45 }, { name: "SEC", val: 90 }
                                            ]}>
                                                <XAxis dataKey="name" strokeWidth={0} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                                <Bar dataKey="val" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "complaints" && (
                        <div className="gov-card p-0 overflow-hidden">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Secure Intelligence Ledger</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="FILTER REPORTS..." 
                                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black tracking-widest focus:outline-none focus:border-[#0ed7b2] transition-colors"
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 text-slate-500">
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Type</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Detail</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Priority</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {complaints.filter(c => c.title?.toLowerCase().includes(searchQuery.toLowerCase())).map((complaint, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-[#0ed7b2] transition-colors">
                                                            {complaint.type === "road" ? <Construction size={16} /> : complaint.type === "health" ? <Stethoscope size={16} /> : <CreditCard size={16} />}
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{complaint.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-bold text-white mb-1 leading-tight uppercase tracking-tight">{complaint.title}</div>
                                                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{complaint.location || "LOC_UNKNOWN"}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-[10px] font-black tracking-[0.2em] px-2 py-1 rounded border ${
                                                        complaint.priority === "High" ? "text-[#ef4444] border-[#ef4444]/20 bg-[#ef4444]/5" : "text-slate-500 border-white/5 bg-white/5"
                                                    }`}>
                                                        {complaint.priority?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-full border ${getStatusStyle(complaint.status)}`}>
                                                        {complaint.status?.toUpperCase() || "PENDING"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {complaints.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <AlertCircle size={48} className="text-slate-700" />
                                                        <div className="text-slate-500 font-black tracking-widest text-sm uppercase">No intelligence records detected in your node profile</div>
                                                        <button onClick={() => setShowComplaintModal(true)} className="text-[#0ed7b2] font-black hover:underline text-xs tracking-[0.2em] uppercase">Initialize First Report</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === "schemes" && (
                        <SchemesPanel
                            onAskAI={(msg) => {
                                setAiInitialMsg(msg);
                                setActiveTab("ai-advisor");
                            }}
                        />
                    )}

                    {activeTab === "ai-advisor" && (
                        <AIAdvisorPanel
                            initialMessage={aiInitialMsg}
                            key={aiInitialMsg}
                        />
                    )}

                    {activeTab === "settings" && (
                        <div className="space-y-8 animate-pop-in">
                            <div className="gov-card border-[var(--border-primary)] bg-[var(--bg-glass)]">
                                <h3 className="text-sm font-black tracking-widest text-[var(--text-secondary)] uppercase mb-6">Visual Interface Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button 
                                        onClick={() => toggleTheme("dark")}
                                        className={`p-6 rounded-2xl border transition-all flex flex-col gap-4 ${
                                            theme === "dark" 
                                            ? "bg-[#0ed7b2]/10 border-[#0ed7b2] shadow-[0_0_20px_rgba(14,215,178,0.1)]" 
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full bg-[#0ed7b2]" />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-black uppercase tracking-widest text-sm ${theme === "dark" ? "text-[#0ed7b2]" : "text-white"}`}>Midnight Protocol</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Optimized for low-light tactical operations</div>
                                        </div>
                                    </button>

                                    <button 
                                        onClick={() => toggleTheme("light")}
                                        className={`p-6 rounded-2xl border transition-all flex flex-col gap-4 ${
                                            theme === "light" 
                                            ? "bg-[#0ed7b2]/10 border-[#0ed7b2] shadow-[0_0_20px_rgba(14,215,178,0.1)]" 
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <div className="w-6 h-6 rounded-full bg-[#0ed7b2]" />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-black uppercase tracking-widest text-sm ${theme === "light" ? "text-[#0ed7b2]" : "text-slate-900"}`}>Lumina Interface</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">High-contrast administrative clarity</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="gov-card border-[var(--border-primary)] bg-[var(--bg-glass)]">
                                <h3 className="text-sm font-black tracking-widest text-[var(--text-secondary)] uppercase mb-6">Security & Resilience</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-[#0ed7b2]/10 text-[#0ed7b2]">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Enhanced Encryption</div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase">AES-256 standard active</div>
                                            </div>
                                        </div>
                                        <div className="w-10 h-6 bg-emerald-500/20 rounded-full p-1 border border-emerald-500/30">
                                             <div className="w-4 h-4 bg-emerald-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Complaint Modal */}
            {showComplaintModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                    <div className="gov-card w-full max-w-[600px] animate-pop-in relative border border-[#0ed7b2]/20">
                        <button onClick={() => setShowComplaintModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="gov-h2 text-2xl uppercase tracking-widest mb-1 font-black">Initiate Secure Report</h2>
                            <p className="gov-muted text-[10px] italic tracking-tight font-black uppercase text-[#0ed7b2]/50">Strategic Intelligence Categorization Module</p>
                        </div>

                        <form onSubmit={handleSubmitComplaint} className="space-y-6">
                            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                                {["road", "health", "banking"].map(type => (
                                    <button 
                                        key={type}
                                        type="button"
                                        onClick={() => setComplaintType(type)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                                            complaintType === type ? "bg-[#0ed7b2] text-[#020617] font-black shadow-lg" : "text-slate-400 font-bold hover:text-white"
                                        }`}
                                    >
                                        {type === "road" ? <Construction size={16} /> : type === "health" ? <Stethoscope size={16} /> : <CreditCard size={16} />}
                                        <span className="text-[10px] uppercase tracking-widest">{type}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                <div>
                                    <label className="block mb-2 ml-1">Report Subject</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors"
                                        placeholder="Brief Subject..."
                                        value={newComplaint.title}
                                        onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 ml-1">Strategic Context</label>
                                    <textarea 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors"
                                        placeholder="Full context for recursive AI analysis..."
                                        rows="4"
                                        value={newComplaint.description}
                                        onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 ml-1">City</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors appearance-none"
                                            value={newComplaint.city}
                                            onChange={(e) => {
                                                const city = e.target.value;
                                                setNewComplaint({...newComplaint, city, area: ""});
                                                setAreasForCity(locations[city] || []);
                                            }}
                                            required
                                        >
                                            <option value="" disabled>Select City</option>
                                            {Object.keys(locations).map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 ml-1">Area / Landmark</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors appearance-none"
                                            value={newComplaint.area}
                                            onChange={(e) => setNewComplaint({...newComplaint, area: e.target.value})}
                                            required
                                            disabled={!newComplaint.city}
                                        >
                                            <option value="" disabled>Select Area</option>
                                            {areasForCity.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1">
                                    <div>
                                        <label className="block mb-2 ml-1">Priority Vector</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors"
                                            value={newComplaint.priority}
                                            onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                                        >
                                            <option value="Low">Low Priority</option>
                                            <option value="Medium">Standard Alert</option>
                                            <option value="High">Priority Breach</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#0ed7b2] text-[#020617] font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_rgba(14,215,178,0.3)] hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest group">
                                <span className="flex items-center justify-center gap-2">
                                    <Shield size={18} />
                                    Submit to Core Engine
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <ChatWidget />
		</div>
	);
};

export default CitizenDashboard;
