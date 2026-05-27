import { useState, useEffect } from "react";
import axios from "axios";

import { API_BASE as BASE } from "../config";
const API_BASE = `${BASE}/schemes`;

const CATEGORIES = [
	"Agriculture", "Agriculture Insurance", "Digital Services", "Education",
	"Employment", "Energy", "Entrepreneurship", "Financial Inclusion",
	"Health", "Housing", "Infrastructure", "Insurance", "Maternal Health",
	"Pension", "Poverty Alleviation", "Savings", "Skill Development",
	"Water & Sanitation", "Women Empowerment"
];

const EMPTY_FORM = {
	name: "", category: "Health", target: "", minAge: 0, maxAge: 100,
	gender: "All", description: "", url: "", icon: "📋"
};

const AdminSchemesPanel = () => {
	const [schemes, setSchemes] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingScheme, setEditingScheme] = useState(null);
	const [form, setForm] = useState(EMPTY_FORM);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState(null);

	useEffect(() => { fetchSchemes(); }, []);

	useEffect(() => {
		if (!search) { setFiltered(schemes); return; }
		const q = search.toLowerCase();
		setFiltered(schemes.filter(s =>
			s.name.toLowerCase().includes(q) ||
			s.category.toLowerCase().includes(q) ||
			s.target.toLowerCase().includes(q)
		));
	}, [search, schemes]);

	const fetchSchemes = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(API_BASE);
			setSchemes(res.data.data || []);
		} catch (err) {
			console.error("Failed to fetch schemes:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const openAddModal = () => {
		setEditingScheme(null);
		setForm(EMPTY_FORM);
		setShowModal(true);
	};

	const openEditModal = (scheme) => {
		setEditingScheme(scheme);
		setForm({
			name: scheme.name, category: scheme.category, target: scheme.target,
			minAge: scheme.minAge, maxAge: scheme.maxAge, gender: scheme.gender,
			description: scheme.description, url: scheme.url, icon: scheme.icon || "📋"
		});
		setShowModal(true);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (editingScheme) {
				await axios.put(`${API_BASE}/${editingScheme._id}`, form);
			} else {
				await axios.post(API_BASE, form);
			}
			setShowModal(false);
			fetchSchemes();
		} catch (err) {
			alert("Error saving scheme: " + (err.response?.data?.message || err.message));
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (id, name) => {
		if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
		setDeletingId(id);
		try {
			await axios.delete(`${API_BASE}/${id}`);
			setSchemes(prev => prev.filter(s => s._id !== id));
		} catch (err) {
			alert("Error deleting scheme: " + (err.response?.data?.message || err.message));
		} finally {
			setDeletingId(null);
		}
	};

	const inputCls = "w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-[#0ed7b2] transition-colors";
	const labelCls = "block text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2";

	return (
		<div className="animate-pop-in space-y-6">
			{/* Header */}
			<div className="gov-card border border-amber-500/20 p-0 overflow-hidden">
				<div style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }} className="px-8 py-6 flex items-center justify-between">
					<div>
						<h2 className="text-xl font-black text-white mb-1 tracking-widest uppercase">🗂️ Scheme Management</h2>
						<p className="text-sm text-amber-200">Create, update, and delete government schemes from the database</p>
					</div>
					<button
						onClick={openAddModal}
						className="bg-white text-amber-800 hover:bg-amber-50 font-black text-sm px-6 py-3 rounded-xl tracking-widest uppercase transition-all shadow-lg flex items-center gap-2"
					>
						＋ Add Scheme
					</button>
				</div>
				<div className="grid grid-cols-3 divide-x divide-white/5 bg-white/[0.02]">
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-amber-400">{schemes.length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Total Schemes</div>
					</div>
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-slate-300">{[...new Set(schemes.map(s => s.category))].length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Categories</div>
					</div>
					<div className="px-6 py-4 text-center">
						<div className="text-2xl font-black text-emerald-400">{filtered.length}</div>
						<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Filtered</div>
					</div>
				</div>
			</div>

			{/* Search */}
			<div className="gov-card">
				<input
					type="text"
					placeholder="🔍 Search schemes by name, category, or target group..."
					className={inputCls}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className="gov-card p-0 overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="flex flex-col items-center gap-4">
							<div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
							<div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Loading Schemes...</div>
						</div>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="border-b border-white/5 bg-white/[0.02]">
									{["Scheme", "Category", "Target", "Age Range", "Gender", "Actions"].map(h => (
										<th key={h} className="px-6 py-4 text-[10px] font-black tracking-widest text-slate-500 uppercase whitespace-nowrap">{h}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-white/5">
								{filtered.map((scheme) => (
									<tr key={scheme._id} className="hover:bg-white/[0.02] group transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<span className="text-lg">{scheme.icon || "📋"}</span>
												<div>
													<div className="text-sm font-black text-white group-hover:text-amber-400 transition-colors max-w-[220px] truncate">{scheme.name}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-[10px] font-black tracking-wide text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-full whitespace-nowrap">{scheme.category}</span>
										</td>
										<td className="px-6 py-4 text-xs text-slate-400 font-bold max-w-[160px] truncate">{scheme.target}</td>
										<td className="px-6 py-4 text-xs text-slate-400 font-bold whitespace-nowrap">{scheme.minAge}–{scheme.maxAge} yrs</td>
										<td className="px-6 py-4 text-xs text-slate-400 font-bold">{scheme.gender}</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<button
													onClick={() => openEditModal(scheme)}
													className="bg-[#0ed7b2]/10 border border-[#0ed7b2]/20 text-[#0ed7b2] hover:bg-[#0ed7b2]/20 font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg transition-all"
												>
													Edit
												</button>
												<button
													onClick={() => handleDelete(scheme._id, scheme.name)}
													disabled={deletingId === scheme._id}
													className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
												>
													{deletingId === scheme._id ? "..." : "Delete"}
												</button>
											</div>
										</td>
									</tr>
								))}
								{filtered.length === 0 && !isLoading && (
									<tr>
										<td colSpan="6" className="px-6 py-16 text-center">
											<div className="text-3xl mb-3">🗂️</div>
											<div className="text-sm font-black tracking-widest text-slate-500 uppercase">No schemes found</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Add/Edit Modal */}
			{showModal && (
				<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-black/70">
					<div className="bg-[#0f172a] border border-amber-500/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-pop-in">
						<div className="sticky top-0 bg-[#0f172a] border-b border-white/5 px-8 py-5 flex items-center justify-between">
							<h3 className="text-lg font-black text-white uppercase tracking-widest">
								{editingScheme ? "✏️ Edit Scheme" : "➕ New Scheme"}
							</h3>
							<button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white text-2xl font-bold transition-colors">×</button>
						</div>

						<form onSubmit={handleSave} className="p-8 space-y-5">
							<div className="grid grid-cols-1 gap-4">
								<div>
									<label className={labelCls}>Scheme Name *</label>
									<input className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. PM Kisan Samman Nidhi" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className={labelCls}>Category *</label>
										<select className={inputCls + " bg-[#0f172a]"} value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
											{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
										</select>
									</div>
									<div>
										<label className={labelCls}>Target Group *</label>
										<input className={inputCls} value={form.target} onChange={e => setForm({...form, target: e.target.value})} required placeholder="e.g. Farmers" />
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<label className={labelCls}>Min Age</label>
										<input className={inputCls} type="number" min="0" max="150" value={form.minAge} onChange={e => setForm({...form, minAge: Number(e.target.value)})} />
									</div>
									<div>
										<label className={labelCls}>Max Age</label>
										<input className={inputCls} type="number" min="0" max="150" value={form.maxAge} onChange={e => setForm({...form, maxAge: Number(e.target.value)})} />
									</div>
									<div>
										<label className={labelCls}>Gender</label>
										<select className={inputCls + " bg-[#0f172a]"} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
											<option value="All">All</option>
											<option value="Female">Female</option>
											<option value="Male">Male</option>
										</select>
									</div>
								</div>
								<div>
									<label className={labelCls}>Description *</label>
									<textarea className={inputCls} rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Brief description of the scheme and its benefits..." />
								</div>
								<div className="grid grid-cols-5 gap-4">
									<div className="col-span-4">
										<label className={labelCls}>Official URL</label>
										<input className={inputCls} type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://example.gov.in" />
									</div>
									<div>
										<label className={labelCls}>Icon</label>
										<input className={inputCls + " text-center text-2xl"} value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} maxLength="2" placeholder="📋" />
									</div>
								</div>
							</div>

							<div className="flex gap-4 pt-2">
								<button
									type="submit"
									disabled={saving}
									className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[#020617] font-black py-4 rounded-2xl text-sm tracking-widest uppercase transition-all shadow-lg"
								>
									{saving ? "Saving..." : editingScheme ? "Update Scheme" : "Create Scheme"}
								</button>
								<button
									type="button"
									onClick={() => setShowModal(false)}
									className="flex-1 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-black py-4 rounded-2xl text-sm tracking-widest uppercase transition-all"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminSchemesPanel;
