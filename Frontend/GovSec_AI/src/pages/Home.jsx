import React, { useState, useEffect } from "react";
import {
	Shield,
	Brain,
	Users,
	TrendingUp,
	Eye,
	Globe,
	ChevronRight,
	Play,
	CheckCircle,
	AlertTriangle,
	BarChart3,
	MessageSquare,
	Lock,
	Zap,
	LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
	const [activeFeature, setActiveFeature] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % 6);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const features = [
		{
			icon: <MessageSquare size={32} />,
			title: "Citizen Complaint Analysis",
			description:
				"AI-powered NLP automatically categorizes and prioritizes citizen complaints",
			color: "linear-gradient(135deg, #3b82f6, #06b6d4)",
		},
		{
			icon: <BarChart3 size={32} />,
			title: "Budget & Scheme Analysis",
			description:
				"Correlate spending patterns with outcomes to optimize resource allocation",
			color: "linear-gradient(135deg, #10b981, #059669)",
		},
		{
			icon: <AlertTriangle size={32} />,
			title: "Fraud & Anomaly Detection",
			description:
				"Advanced ML algorithms detect suspicious activities and prevent misuse",
			color: "linear-gradient(135deg, #ef4444, #ec4899)",
		},
		{
			icon: <Brain size={32} />,
			title: "Policy Recommendation Engine",
			description:
				"Simulate policy impacts before implementation using reinforcement learning",
			color: "linear-gradient(135deg, #8b5cf6, #6366f1)",
		},
		{
			icon: <TrendingUp size={32} />,
			title: "Sentiment Analysis",
			description:
				"Monitor public mood and detect misinformation campaigns across social media",
			color: "linear-gradient(135deg, #f59e0b, #eab308)",
		},
		{
			icon: <Lock size={32} />,
			title: "Security & Transparency",
			description: "Blockchain-based audit trails with zero trust architecture",
			color: "linear-gradient(135deg, #4b5563, #374151)",
		},
	];

	const stats = [
		{
			label: "Complaint Resolution",
			value: "85%",
			description: "Faster processing",
		},
		{ label: "Fraud Detection", value: "92%", description: "Accuracy rate" },
		{
			label: "Policy Impact",
			value: "78%",
			description: "Prediction accuracy",
		},
		{ label: "Citizen Trust", value: "67%", description: "Improvement" },
	];

	return (
		<div className="min-h-screen bg-[#020617] text-white selection:bg-[#0ed7b2]/30 selection:text-[#0ed7b2] font-sans">
			{/* Background Visuals */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0ed7b2]/10 rounded-full blur-[140px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[140px] animate-pulse delay-1000" />
			</div>

			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/50 backdrop-blur-xl border-b border-white/5">
				<div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="gov-logo scale-110">G</div>
						<span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">GovSecAI</span>
					</div>
					
					<div className="hidden md:flex items-center gap-12">
						<a href="#features" className="text-[10px] font-black tracking-[0.2em] text-slate-500 hover:text-[#0ed7b2] transition-colors uppercase">Capabilities</a>
						<a href="#framework" className="text-[10px] font-black tracking-[0.2em] text-slate-500 hover:text-[#0ed7b2] transition-colors uppercase">Framework</a>
						<div className="flex items-center gap-4">
							<Link 
								to="/signin" 
								className="text-[10px] font-black tracking-[0.2em] text-white px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all uppercase"
							>
								Log In
							</Link>
							<Link 
								to="/register" 
								className="text-[10px] font-black tracking-[0.2em] bg-[#0ed7b2] text-[#020617] px-6 py-2 rounded-xl hover:bg-[#059669] transition-all shadow-[0_0_20px_rgba(14,215,178,0.2)] uppercase"
							>
								Initialize
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative pt-48 pb-32 px-8">
				<div className="max-w-7xl mx-auto text-center relative z-10">
					<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0ed7b2]/5 border border-[#0ed7b2]/10 text-[#0ed7b2] text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-pop-in">
						<Zap size={12} fill="currentColor" />
						Intelligence Core V4.2
					</div>
					<h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] uppercase">
						Next Gen <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ed7b2] via-white to-[#3b82f6]">Secure Governance</span>
					</h1>
					<p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-bold leading-relaxed mb-16 uppercase tracking-tight opacity-80">
						Bridging administration and citizens through <br className="hidden md:block" /> decentralized intelligence and secure protocols.
					</p>
					
					<div className="flex flex-col sm:flex-row items-center justify-center gap-8">
						<Link 
							to="/register" 
							className="w-full sm:w-auto bg-[#0ed7b2] hover:bg-[#059669] text-[#020617] px-12 py-6 rounded-2xl text-sm font-black transition-all shadow-[0_0_40px_rgba(14,215,178,0.3)] flex items-center justify-center gap-3 active:scale-95 group uppercase tracking-[0.2em]"
						>
							Initialize Portal
							<ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link 
							to="/signin" 
							className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-6 rounded-2xl text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
						>
							<LogIn size={20} />
							Member Login
						</Link>
					</div>
				</div>
			</section>

			{/* Stats Grid */}
			<section className="py-24 px-8 border-y border-white/5 bg-white/[0.01]">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
						{stats.map((stat, i) => (
							<div key={i} className="text-center group">
								<div className="text-5xl font-black text-white mb-3 group-hover:text-[#0ed7b2] transition-colors tracking-tighter">{stat.value}</div>
								<div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ed7b2] mb-2">{stat.label}</div>
								<div className="text-xs text-slate-500 font-bold uppercase tracking-tight">{stat.description}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="py-32 px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-24">
						<div className="text-[#0ed7b2] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Core Capacities</div>
						<h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">Advanced Systems <br /> Infrastructure</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{features.map((feature, i) => (
							<div key={i} className="gov-card p-12 group hover:border-[#0ed7b2]/40 transition-all duration-500 flex flex-col items-center text-center">
								<div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-[#0ed7b2] mb-10 group-hover:scale-110 group-hover:bg-[#0ed7b2]/10 transition-all duration-700 shadow-inner">
									{feature.icon}
								</div>
								<h3 className="text-xl font-black mb-4 uppercase tracking-tight group-hover:text-[#0ed7b2] transition-colors">{feature.title}</h3>
								<p className="text-slate-400 font-bold leading-relaxed text-sm opacity-80 uppercase tracking-tight">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Framework Info */}
			<section id="framework" className="py-32 px-8 bg-white/[0.01] border-t border-white/5 overflow-hidden">
				<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
					<div className="flex-1 space-y-8 text-left">
						<div className="text-[#3b82f6] text-[10px] font-black uppercase tracking-[0.3em]">Technical Framework</div>
						<h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-white">Zero Trust <br /> <span className="text-slate-500">Architecture</span></h2>
						<p className="text-slate-400 text-lg font-bold leading-relaxed uppercase tracking-tight opacity-70">
							Leveraging homomorphic encryption and blockchain ledgers to ensure absolute integrity of administrative data across all nodes.
						</p>
						<div className="flex flex-wrap gap-4 pt-4">
							{["BERT TRANSFORMERS", "BLOCKCHAIN LEDGER", "SECURE ENCLAVE", "ZK PROOFS"].map(tech => (
								<span key={tech} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
									{tech}
								</span>
							))}
						</div>
					</div>
					<div className="flex-1 relative">
						<div className="p-10 rounded-[40px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 backdrop-blur-3xl relative z-10">
							<div className="aspect-square flex items-center justify-center">
								<Shield size={240} className="text-[#0ed7b2] opacity-20 absolute" />
								<div className="relative space-y-6 w-full uppercase tracking-widest">
									<div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
										<CheckCircle className="text-[#0ed7b2]" />
										<span className="text-xs font-black">Identity Verified</span>
									</div>
									<div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 ml-8 opacity-60">
										<Lock className="text-[#3b82f6]" />
										<span className="text-xs font-black">Encrypted Tunnel</span>
									</div>
									<div className="flex items-center gap-4 bg-[#0ed7b2]/10 p-4 rounded-2xl border border-[#0ed7b2]/20">
										<Zap className="text-[#0ed7b2]" />
										<span className="text-xs font-black">Node: GLOBAL_PRIMARY</span>
									</div>
								</div>
							</div>
						</div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0ed7b2]/5 rounded-full blur-[100px] -z-1" />
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-40 px-8 text-center bg-[#020617] relative">
				<div className="max-w-4xl mx-auto space-y-12 relative z-10">
					<h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">Join The <br /><span className="text-[#0ed7b2]">Secure Future</span></h2>
					<p className="text-slate-400 text-xl font-bold uppercase tracking-tight opacity-70">Initialize your node session today to participate in a more transparent and efficient society.</p>
					<div className="flex justify-center">
						<Link 
							to="/register" 
							className="bg-white text-[#020617] px-16 py-8 rounded-[30px] text-lg font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
						>
							Initialize Now
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-24 px-8 border-t border-white/5 bg-[#020617] text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
					<div className="flex items-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
						<div className="gov-logo">G</div>
						<span className="text-xl font-black tracking-tighter lowercase">GovSecAI</span>
					</div>
					<div className="flex gap-12">
						<a href="#" className="hover:text-white transition-colors">Privacy</a>
						<a href="#" className="hover:text-white transition-colors">Security</a>
						<a href="#" className="hover:text-white transition-colors">Nodes</a>
					</div>
					<div>
						&copy; 2026 DEPT. OF SECURE GOVERNANCE INFRASTRUCTURE
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
