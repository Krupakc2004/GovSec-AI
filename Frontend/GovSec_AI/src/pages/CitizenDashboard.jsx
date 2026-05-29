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
    Menu,
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
    const [mobSidebarOpen, setMobSidebarOpen] = useState(false);
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
    const [evidenceFile, setEvidenceFile] = useState(null);

    // Effect: Load User Data
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("govsec_user"));
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
            const formData = new FormData();
            formData.append("module", complaintType);
            formData.append("citizen_email", userData?.email);
            formData.append("title", newComplaint.title);
            formData.append("description", newComplaint.description);
            formData.append("city", newComplaint.city);
            formData.append("area", newComplaint.area);
            formData.append("priority", newComplaint.priority);
            if (evidenceFile) {
                formData.append("evidence", evidenceFile);
            }

            await axios.post(`${API_BASE}/dashboard/complaint`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Complaint filed successfully!");
            setShowComplaintModal(false);
            setEvidenceFile(null);
            setNewComplaint({ title: "", description: "", city: "", area: "", priority: "Medium" });
            fetchComplaints(userData.email);
        } catch (error) {
            const msg = error.response?.data?.message || "Error filing complaint";
            toast.error(msg);
        }
    };

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("govsec_theme", newTheme);
    };

    const logout = () => {
        localStorage.clear();
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
            onClick={() => { setActiveTab(id); setMobSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                activeTab === id 
                ? "bg-[var(--primary)] text-white shadow-sm font-semibold" 
                : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
            }`}
        >
            <Icon size={20} className={activeTab === id ? "" : "group-hover:scale-110 transition-transform"} />
            {(isSidebarOpen || mobSidebarOpen) && <span className="text-sm tracking-tight">{label}</span>}
        </button>
    );

    if (!userData) return <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center text-[var(--primary)] font-semibold">Initializing Secure Session...</div>;

	return (
		<div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${theme === "light" ? "light-theme" : ""} bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
            {/* Mobile overlay */}
            {mobSidebarOpen && (
                <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 199 }}
                    onClick={() => setMobSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`cit-sidebar ${mobSidebarOpen ? "mob-open" : ""} ${isSidebarOpen || mobSidebarOpen ? "w-[280px]" : "w-[90px]"} bg-[var(--bg-sidebar)] border-r border-white/5 flex flex-col p-6 transition-all duration-500 relative z-[200] shadow-2xl`}>
                <div className="flex items-center gap-4 mb-12 px-2">
                    <div className="gov-logo scale-110">G</div>
                    {(isSidebarOpen || mobSidebarOpen) && <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Citizen Node</span>}
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
                        {(isSidebarOpen || mobSidebarOpen) && <span className="text-sm tracking-tight font-medium">My Profile</span>}
                    </button>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <SidebarItem id="settings" icon={Settings} label="Setting" />
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[#ef4444] hover:bg-red-500/10 transition-all font-medium group">
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        {(isSidebarOpen || mobSidebarOpen) && <span className="text-sm tracking-tight">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="cit-main flex-1 overflow-y-auto relative bg-[var(--bg-primary)]">
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary-dim)] rounded-full blur-[100px] pointer-events-none" />
                
                {/* Header */}
                <header className="sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] mb-1">
                            {activeTab === "overview" ? "Strategic Intelligence" : activeTab === "complaints" ? "Citizen Complaints" : activeTab === "schemes" ? "Government Schemes" : activeTab === "ai-advisor" ? "AI Policy Advisor" : "Strategic Configuration"}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                            <span className="text-xs font-medium text-[var(--text-muted)]">Secure Link: {userData.email}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Hamburger for mobile */}
                        <button
                            className="cit-hamburger"
                            onClick={() => setMobSidebarOpen(p => !p)}
                            aria-label="Toggle menu"
                        >
                            {mobSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <button 
                            onClick={() => setShowComplaintModal(true)} 
                            className="bg-[var(--primary)] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">New Report</span>
                            <span className="sm:hidden">+</span>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-pop-in">
                    {activeTab === "overview" && (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                                <div className="gov-card flex flex-col group hover:border-slate-600 transition-all cursor-default relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary-dim)] rounded-bl-full group-hover:scale-110 transition-transform duration-500" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] mb-1">Total Reports</span>
                                    <div className="text-4xl font-bold text-[var(--text-main)]">{complaints.length}</div>
                                    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden flex items-center">
                                       <div className="h-full bg-[var(--primary)] w-[42%]"></div>
                                    </div>
                                </div>
                                <div className="gov-card flex flex-col group hover:border-slate-600 transition-all cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] mb-1">In Progress</span>
                                    <div className="text-4xl font-bold text-[var(--text-main)]">{complaints.filter(c => c.status === "Pending" || c.status === "In Progress").length}</div>
                                    <div className="mt-4 text-[10px] font-semibold text-blue-500">Active Monitoring</div>
                                </div>
                                <div className="gov-card flex flex-col group hover:border-slate-600 transition-all cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500" />
                                    <span className="text-xs font-semibold text-[var(--text-muted)] mb-1">Resolved</span>
                                    <div className="text-4xl font-bold text-[var(--text-main)]">{complaints.filter(c => c.status === "Resolved" || c.status === "Completed").length}</div>
                                    <div className="mt-4 text-[10px] font-semibold text-emerald-500">Compliance Reached</div>
                                </div>
                                <div className="gov-card flex flex-col items-start justify-center group hover:border-slate-600 transition-all relative overflow-hidden bg-[var(--primary-dim)]">
                                    <span className="text-sm font-semibold text-[var(--primary)] mb-2">Need Assistance?</span>
                                    <button 
                                        onClick={() => setShowComplaintModal(true)} 
                                        className="bg-[var(--primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95 z-10"
                                    >
                                        <Plus size={16} />
                                        File New Report
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area: Schemes & AI */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {/* Left Col: Featured Schemes */}
                                <div className="gov-card p-0 overflow-hidden flex flex-col">
                                    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
                                            <BookOpen size={16} className="text-[var(--primary)]" />
                                            Featured Schemes
                                        </h3>
                                        <button onClick={() => setActiveTab("schemes")} className="text-xs font-medium text-[var(--primary)] hover:underline">
                                            View All
                                        </button>
                                    </div>
                                    <div className="p-6 flex-1 space-y-4">
                                        {/* Scheme 1 */}
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => setActiveTab("schemes")}>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 mt-1"><Stethoscope size={16} /></div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[var(--text-main)] mb-1">Ayushman Bharat Yojana</h4>
                                                    <p className="text-xs text-[var(--text-muted)] font-medium">Free health coverage up to ₹5 Lakhs per family per year.</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Scheme 2 */}
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => setActiveTab("schemes")}>
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mt-1"><Activity size={16} /></div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-[var(--text-main)] mb-1">PM Kisan Samman Nidhi</h4>
                                                    <p className="text-xs text-[var(--text-muted)] font-medium">Income support of ₹6,000 per year for landholding farmers.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: AI & Recent Activity */}
                                <div className="flex flex-col gap-6 sm:gap-8">
                                    {/* AI Quick Access */}
                                    <div className="gov-card p-6 bg-gradient-to-br from-[var(--primary-dim)] to-transparent border border-[var(--primary)]/20 relative overflow-hidden">
                                        <div className="absolute right-[-20px] top-[-20px] opacity-10">
                                            <Bot size={120} />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[var(--text-main)] mb-2 flex items-center gap-2">
                                            <Bot size={16} className="text-[var(--primary)]" />
                                            Ask AI Advisor
                                        </h3>
                                        <p className="text-xs text-[var(--text-muted)] font-medium mb-4 max-w-[80%]">Have questions about eligibility or how to apply? Ask our AI assistant immediately.</p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="e.g., Am I eligible for Ayushman Bharat?" 
                                                className="flex-1 bg-[var(--bg-dark)] border border-white/10 rounded-lg px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        setAiInitialMsg(e.target.value);
                                                        setActiveTab("ai-advisor");
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling;
                                                    if (input.value.trim()) {
                                                        setAiInitialMsg(input.value);
                                                        setActiveTab("ai-advisor");
                                                    }
                                                }}
                                                className="bg-[var(--primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <Search size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="gov-card p-0 flex-1 flex flex-col">
                                        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                                            <h3 className="text-sm font-semibold text-[var(--text-main)]">Recent Activity</h3>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            {complaints.length === 0 ? (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                                        <FileWarning size={20} className="text-[var(--text-muted)]" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-[var(--text-main)] mb-1">No reports filed yet</p>
                                                    <p className="text-xs text-[var(--text-muted)] font-medium">Your filed reports and their status will appear here.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {complaints.slice(0, 3).map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 rounded-lg bg-white/5 text-[var(--primary)]">
                                                                    {c.type === "road" ? <Construction size={14} /> : c.type === "health" ? <Stethoscope size={14} /> : <CreditCard size={14} />}
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-semibold text-[var(--text-main)]">{c.title}</div>
                                                                    <div className="text-[10px] text-[var(--text-muted)] font-medium">{c.location}</div>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${getStatusStyle(c.status)}`}>
                                                                {c.status || "Pending"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {complaints.length > 3 && (
                                                        <button onClick={() => setActiveTab("complaints")} className="w-full text-center text-xs font-semibold text-[var(--primary)] hover:underline mt-2">
                                                            View all {complaints.length} reports
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
                                <div>
                                    <label className="block mb-2 ml-1">Evidence Photo (Optional - OpenCV CV Verified)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => setEvidenceFile(e.target.files[0])}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors"
                                    />
                                    {evidenceFile && <div className="text-[9px] text-[#0ed7b2] mt-2 font-black uppercase tracking-widest">Selected file: {evidenceFile.name}</div>}
                                </div>
                                <div className="grid grid-cols-1">
                                    <div>
                                        <label className="block mb-2 ml-1">Priority Vector (AI Automated Triage)</label>
                                        <div className="w-full bg-white/5 border border-[#0ed7b2]/20 rounded-2xl p-4 text-[10px] font-black tracking-widest text-[#0ed7b2] uppercase">
                                            🤖 Auto-Priority Active (Analyzed via TextBlob Sentiment Polarity)
                                        </div>
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
