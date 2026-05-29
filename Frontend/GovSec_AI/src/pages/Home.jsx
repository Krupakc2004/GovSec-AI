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
		<div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] selection:bg-[var(--primary)] selection:text-white font-sans">
			{/* Background Visuals */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--primary-dim)] rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary-dim)] rounded-full blur-[100px] animate-pulse delay-1000" />
			</div>

			{/* Navigation */}
			<nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-dark)]/80 backdrop-blur-md border-b border-white/5">
				<div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="gov-logo scale-110">G</div>
						<span className="text-xl font-bold tracking-tight whitespace-nowrap text-[var(--text-main)]">GovSecAI</span>
					</div>
					
					<div className="hidden md:flex items-center gap-12">
						<a href="#features" className="text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors">Capabilities</a>
						<a href="#framework" className="text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors">Framework</a>
						<div className="flex items-center gap-4">
							<Link 
								to="/signin" 
								className="text-xs font-semibold text-white px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
							>
								Log In
							</Link>
							<Link 
								to="/register" 
								className="text-xs font-semibold bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-sm"
							>
								Get Started
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative pt-48 pb-32 px-8">
				<div className="max-w-7xl mx-auto text-center relative z-10">
					<div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary-dim)] border border-blue-500/20 text-[var(--primary)] text-xs font-semibold mb-12 animate-pop-in">
						<Zap size={12} fill="currentColor" />
						Intelligence Core V4.2
					</div>
					<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight text-[var(--text-main)]">
						Next Generation <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Secure Governance</span>
					</h1>
					<p className="max-w-2xl mx-auto text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed mb-12">
						Bridging administration and citizens through <br className="hidden md:block" /> decentralized intelligence and secure protocols.
					</p>
					
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
						<Link 
							to="/register" 
							className="w-full sm:w-auto bg-[var(--primary)] hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95 group"
						>
							Initialize Portal
							<ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link 
							to="/signin" 
							className="w-full sm:w-auto bg-[var(--bg-accent)] hover:bg-slate-700 text-white border border-white/10 px-8 py-4 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-3"
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
								<div className="text-4xl font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">{stat.value}</div>
								<div className="text-sm font-semibold text-[var(--primary)] mb-1">{stat.label}</div>
								<div className="text-xs text-[var(--text-muted)] font-medium">{stat.description}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features */}
			<section id="features" className="py-32 px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-24">
						<div className="text-[var(--primary)] text-sm font-semibold mb-2">Core Capacities</div>
						<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">Advanced Systems <br /> Infrastructure</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{features.map((feature, i) => (
							<div key={i} className="gov-card p-10 group hover:border-[var(--primary)]/30 transition-all duration-300 flex flex-col items-center text-center">
								<div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[var(--primary)] mb-6 group-hover:scale-110 group-hover:bg-[var(--primary-dim)] transition-all duration-500 shadow-sm">
									{feature.icon}
								</div>
								<h3 className="text-lg font-bold mb-3 text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{feature.title}</h3>
								<p className="text-[var(--text-muted)] font-medium text-sm leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Framework Info */}
			<section id="framework" className="py-32 px-8 bg-white/[0.01] border-t border-white/5 overflow-hidden">
				<div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
					<div className="flex-1 space-y-8 text-left">
						<div className="text-[var(--primary)] text-sm font-semibold mb-2">Technical Framework</div>
						<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-main)]">Zero Trust <br /> <span className="text-slate-500">Architecture</span></h2>
						<p className="text-[var(--text-muted)] text-lg font-medium leading-relaxed">
							Leveraging advanced encryption and secure ledgers to ensure absolute integrity of administrative data across all nodes.
						</p>
						<div className="flex flex-wrap gap-4 pt-4">
							{["Smart Contracts", "Secure Enclave", "Zero Knowledge Proofs"].map(tech => (
								<span key={tech} className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
									{tech}
								</span>
							))}
						</div>
					</div>
					<div className="flex-1 relative">
						<div className="p-10 rounded-[32px] bg-gradient-to-br from-[var(--primary-dim)] to-[var(--secondary-dim)] border border-white/10 backdrop-blur-3xl relative z-10">
							<div className="aspect-square flex items-center justify-center">
								<Shield size={240} className="text-[var(--primary)] opacity-20 absolute" />
								<div className="relative space-y-6 w-full">
									<div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
										<CheckCircle className="text-[var(--success)]" />
										<span className="text-sm font-semibold text-white">Identity Verified</span>
									</div>
									<div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 ml-8 opacity-60">
										<Lock className="text-indigo-400" />
										<span className="text-sm font-semibold text-white">Encrypted Tunnel</span>
									</div>
									<div className="flex items-center gap-4 bg-[var(--primary-dim)] p-4 rounded-xl border border-[var(--primary)]/20">
										<Zap className="text-[var(--primary)]" />
										<span className="text-sm font-semibold text-white">Node Active</span>
									</div>
								</div>
							</div>
						</div>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--primary-dim)] rounded-full blur-[100px] -z-1" />
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-40 px-8 text-center bg-[var(--bg-dark)] relative border-t border-white/5">
				<div className="max-w-4xl mx-auto space-y-8 relative z-10">
					<h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--text-main)]">Join The <br /><span className="text-[var(--primary)]">Secure Future</span></h2>
					<p className="text-[var(--text-muted)] text-xl font-medium">Initialize your session today to participate in a more transparent and efficient society.</p>
					<div className="flex justify-center pt-8">
						<Link 
							to="/register" 
							className="bg-white text-slate-900 px-12 py-5 rounded-lg text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-md"
						>
							Initialize Now
						</Link>
					</div>
				</div>
			</section>

			{/* Footer */}
			<section className="py-12 px-8 border-t border-white/5 bg-[var(--bg-dark)] text-[var(--text-muted)] font-medium text-sm">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex items-center gap-4 hover:text-white transition-all">
						<div className="gov-logo scale-75">G</div>
						<span className="font-bold tracking-tight">GovSecAI</span>
					</div>
					<div className="flex gap-8">
						<a href="#" className="hover:text-white transition-colors">Privacy</a>
						<a href="#" className="hover:text-white transition-colors">Security</a>
						<a href="#" className="hover:text-white transition-colors">Platform</a>
					</div>
					<div>
						&copy; 2026 GovSecAI. All rights reserved.
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
