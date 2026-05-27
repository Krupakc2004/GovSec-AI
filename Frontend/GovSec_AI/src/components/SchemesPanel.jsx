import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { API_BASE } from "../config";

const CATEGORY_ICONS = {
	"Health": "🏥", "Agriculture": "🌾", "Women Empowerment": "👩",
	"Housing": "🏠", "Financial Inclusion": "🏦", "Education": "📚",
	"Pension": "🧓", "Entrepreneurship": "💼", "Agriculture Insurance": "🛡️",
	"Savings": "💰", "Maternal Health": "🤰", "Energy": "🔥",
	"Skill Development": "🎯", "Employment": "💼", "Water & Sanitation": "💧",
	"Infrastructure": "🛣️", "Digital Services": "📱", "Insurance": "🛡️",
	"Poverty Alleviation": "🤝", "default": "📋"
};

const SchemesPanel = ({ onAskAI }) => {
	const [schemes, setSchemes] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [categories, setCategories] = useState([]);
	const [search, setSearch] = useState("");
	const [catFilter, setCatFilter] = useState("");
	const [selectedScheme, setSelectedScheme] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const searchRef = useRef(null);

	useEffect(() => {
		fetchSchemes();
	}, []);

	const fetchSchemes = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${API_BASE}/schemes`);
			const data = res.data.data || [];
			setSchemes(data);
			setFiltered(data);
			const cats = [...new Set(data.map(s => s.category))].sort();
			setCategories(cats);
		} catch (err) {
			console.error("Failed to fetch schemes:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		let result = schemes;
		if (catFilter) result = result.filter(s => s.category === catFilter);
		if (search) {
			const q = search.toLowerCase();
			result = result.filter(s =>
				s.name.toLowerCase().includes(q) ||
				s.category.toLowerCase().includes(q) ||
				s.target.toLowerCase().includes(q) ||
				s.description.toLowerCase().includes(q)
			);
		}
		setFiltered(result);
	}, [search, catFilter, schemes]);

	const handleAskAI = (schemeName) => {
		if (onAskAI) onAskAI(`Tell me more about ${schemeName} and how I can apply for it.`);
	};

	if (selectedScheme) {
		const icon = CATEGORY_ICONS[selectedScheme.category] || CATEGORY_ICONS.default;
		return (
			<div className="animate-pop-in space-y-6">
				<button
					onClick={() => setSelectedScheme(null)}
					className="flex items-center gap-2 text-[#0ed7b2] hover:text-white text-sm font-black tracking-widest uppercase transition-colors"
				>
					← Back to Schemes
				</button>

				<div className="gov-card border border-[#0ed7b2]/20 p-0 overflow-hidden">
					<div style={{ background: "linear-gradient(135deg, #0b3d91, #1a5abf)" }} className="p-8">
						<div className="text-5xl mb-4">{icon}</div>
						<h2 className="text-2xl font-black text-white mb-2 leading-tight">{selectedScheme.name}</h2>
						<span className="inline-block bg-white/10 text-[#FFD080] text-xs font-black tracking-widest px-3 py-1 rounded-full border border-white/20">
							{selectedScheme.category}
						</span>
					</div>

					<div className="p-8 space-y-6">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{[
								{ label: "Target Group", value: `👥 ${selectedScheme.target}` },
								{ label: "Age Eligibility", value: `📅 ${selectedScheme.minAge} – ${selectedScheme.maxAge} yrs` },
								{ label: "Gender", value: selectedScheme.gender === "Female" ? "♀️ Women Only" : "⚧ All Genders" },
								{ label: "Category", value: `🏷️ ${selectedScheme.category}` },
							].map(item => (
								<div key={item.label} className="bg-white/5 border border-white/5 rounded-2xl p-4">
									<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">{item.label}</div>
									<div className="text-sm font-bold text-white">{item.value}</div>
								</div>
							))}
						</div>

						<div className="bg-white/5 border border-white/5 rounded-2xl p-6">
							<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">Description</div>
							<p className="text-sm text-slate-300 leading-relaxed">{selectedScheme.description}</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4">
							<a
								href={selectedScheme.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-center text-sm tracking-widest uppercase transition-all shadow-lg"
							>
								🔗 Visit Official Website
							</a>
							<button
								onClick={() => handleAskAI(selectedScheme.name)}
								className="flex-1 border-2 border-[#0ed7b2] text-[#0ed7b2] hover:bg-[#0ed7b2] hover:text-[#020617] font-black py-4 rounded-2xl text-sm tracking-widest uppercase transition-all"
							>
								🤖 Ask AI About This Scheme
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-pop-in space-y-6">
			{/* Header */}
			<div className="gov-card border border-[#0ed7b2]/20 p-0 overflow-hidden">
				<div style={{ background: "linear-gradient(135deg, #0b3d91 0%, #1a5abf 100%)" }} className="px-8 py-6">
					<h2 className="text-xl font-black text-white mb-1 tracking-widest uppercase">📋 Government Schemes</h2>
					<p className="text-sm text-slate-300">Browse 45+ Central Government schemes for housing, health, agriculture, education & more</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 divide-x divide-white/5 bg-white/[0.02]">
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-[#0ed7b2]">{schemes.length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Total Schemes</div>
					</div>
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-amber-400">{categories.length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Categories</div>
					</div>
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-emerald-400">{filtered.length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Showing</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="gov-card flex flex-col sm:flex-row gap-4">
				<input
					ref={searchRef}
					type="text"
					placeholder="🔍 Search schemes by name, category, target..."
					className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#0ed7b2] transition-colors"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select
					className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors min-w-[200px]"
					value={catFilter}
					onChange={e => setCatFilter(e.target.value)}
				>
					<option value="">All Categories</option>
					{categories.map(c => <option key={c} value={c}>{c}</option>)}
				</select>
			</div>

			{/* Scheme List */}
			<div className="gov-card p-0 overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-4">
							<div className="w-8 h-8 border-2 border-[#0ed7b2] border-t-transparent rounded-full animate-spin" />
							<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Loading Schemes...</div>
						</div>
					</div>
				) : filtered.length === 0 ? (
					<div className="py-20 text-center">
						<div className="text-4xl mb-4">🔍</div>
						<div className="text-sm font-black tracking-widest text-slate-500 uppercase">No schemes found</div>
						<button onClick={() => { setSearch(""); setCatFilter(""); }} className="mt-4 text-[#0ed7b2] text-xs font-black tracking-widest uppercase hover:underline">
							Clear Filters
						</button>
					</div>
				) : (
					<div className="divide-y divide-white/5">
						{filtered.map((scheme, i) => {
							const icon = CATEGORY_ICONS[scheme.category] || CATEGORY_ICONS.default;
							return (
								<div
									key={scheme._id || i}
									className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] cursor-pointer group transition-colors"
									onClick={() => setSelectedScheme(scheme)}
								>
									<div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#0ed7b2]/10 transition-colors">
										{icon}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm font-black text-white truncate group-hover:text-[#0ed7b2] transition-colors">{scheme.name}</div>
										<div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
											{scheme.category} · {scheme.target} · Age {scheme.minAge}–{scheme.maxAge}
										</div>
									</div>
									<div className="text-slate-600 group-hover:text-[#0ed7b2] transition-colors font-black text-lg">›</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default SchemesPanel;
