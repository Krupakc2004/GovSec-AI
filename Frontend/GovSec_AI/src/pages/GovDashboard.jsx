import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminSchemesPanel from "../components/AdminSchemesPanel";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	ArcElement,
	RadialLinearScale,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import { Line, Bar, Doughnut, PolarArea } from "react-chartjs-2";
import {
	LayoutDashboard,
	Construction,
	Stethoscope,
	CreditCard,
	BookOpen,
	LogOut,
	Bell,
	RefreshCw,
	MapPin,
	Calendar,
	Eye,
	CheckCircle2,
	ChevronRight,
	Activity,
	Shield,
	TrendingUp,
	AlertTriangle,
	Menu,
	X,
} from "lucide-react";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	LineElement,
	PointElement,
	ArcElement,
	RadialLinearScale,
	Filler,
	Tooltip,
	Legend
);

import { API_BASE as BASE } from "../config";
const API_BASE = `${BASE}/dashboard`;

const getFullImageUrl = (url) => {
	if (!url) return null;
	if (url.startsWith("http")) return url;
	const serverBase = BASE.replace("/api/v1", "").replace("/api", "");
	return `${serverBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

const GovDashboard = () => {
	const navigate = useNavigate();
	const [activeModule, setActiveModule] = useState("home");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [apiStatus, setApiStatus] = useState("Checking...");
	const [apiOnline, setApiOnline] = useState(false);

	// Home data
	const [stats, setStats] = useState(null);

	// Module data
	const [roadCities, setRoadCities] = useState([]);
	const [roadAreas, setRoadAreas] = useState([]);
	const [healthCities, setHealthCities] = useState([]);
	const [healthAreas, setHealthAreas] = useState([]);
	const [fraudCities, setFraudCities] = useState([]);
	const [fraudAreas, setFraudAreas] = useState([]);
	const [selectedRoadCity, setSelectedRoadCity] = useState(null);
	const [selectedHealthCity, setSelectedHealthCity] = useState(null);
	const [selectedFraudCity, setSelectedFraudCity] = useState(null);

	// Modal
	const [modal, setModal] = useState(null);
	const [modalComplaints, setModalComplaints] = useState([]);
	const [modalStatus, setModalStatus] = useState("Pending");
	const [detailModal, setDetailModal] = useState(null);

	// Lightbox
	const [lightboxImg, setLightboxImg] = useState(null);

	// User info
	const userStr = localStorage.getItem("govsec_user");
	const user = userStr ? JSON.parse(userStr) : {};

	// --- API Check ---
	const checkApi = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/ping`);
			const j = await r.json();
			if (j.status === "ok") {
				setApiStatus("Online");
				setApiOnline(true);
			}
		} catch {
			setApiStatus("Offline");
			setApiOnline(false);
		}
	}, []);

	// --- Home Data ---
	const loadHomeData = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/stats`);
			const data = await r.json();
			setStats(data);
		} catch (e) {
			console.error("Home data error:", e);
		}
	}, []);

	// --- Road ---
	const loadRoadData = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/road/summary`);
			const data = await r.json();
			const cities = data.complaints_by_city || {};
			const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]);
			setRoadCities(sorted);
			setRoadAreas([]);
			setSelectedRoadCity(null);
		} catch (e) {
			console.error(e);
		}
	}, []);

	const loadRoadAreas = useCallback(async (city) => {
		setSelectedRoadCity(city);
		try {
			const r = await fetch(
				`${API_BASE}/road/areas/${encodeURIComponent(city)}`
			);
			const data = await r.json();
			const areas = data.area_counts || {};
			setRoadAreas(
				Object.entries(areas)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 15)
			);
		} catch (e) {
			console.error(e);
		}
	}, []);

	// --- Health ---
	const loadHealthData = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/health/summary`);
			const data = await r.json();
			const cities = data.complaints_by_city || {};
			const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]);
			setHealthCities(sorted);
			setHealthAreas([]);
			setSelectedHealthCity(null);
		} catch (e) {
			console.error(e);
		}
	}, []);

	const loadHealthAreas = useCallback(async (city) => {
		setSelectedHealthCity(city);
		try {
			const r = await fetch(
				`${API_BASE}/health/areas/${encodeURIComponent(city)}`
			);
			const data = await r.json();
			const areas = data.area_counts || {};
			setHealthAreas(
				Object.entries(areas)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 15)
			);
		} catch (e) {
			console.error(e);
		}
	}, []);

	// --- Fraud ---
	const loadFraudData = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/fraud/summary`);
			const data = await r.json();
			const cities = data.fraud_by_city || {};
			const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]);
			setFraudCities(sorted);
			setFraudAreas([]);
			setSelectedFraudCity(null);
		} catch (e) {
			console.error(e);
		}
	}, []);

	const loadFraudAreas = useCallback(async (city) => {
		setSelectedFraudCity(city);
		try {
			const r = await fetch(
				`${API_BASE}/fraud/areas/${encodeURIComponent(city)}`
			);
			const data = await r.json();
			const areas = data.area_counts || {};
			setFraudAreas(
				Object.entries(areas)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 15)
			);
		} catch (e) {
			console.error(e);
		}
	}, []);

	// --- Modal ---
	const openModal = async (module, city, area, count) => {
		setModal({ module, city, area, count });
		setModalStatus("Pending");
		setModalComplaints([]);

		try {
			const [statusRes, listRes] = await Promise.all([
				fetch(
					`${API_BASE}/${module}/area-status/${encodeURIComponent(
						city
					)}/${encodeURIComponent(area)}`
				),
				fetch(
					`${API_BASE}/${module}/list/${encodeURIComponent(
						city
					)}/${encodeURIComponent(area)}`
				),
			]);
			const statusData = await statusRes.json();
			setModalStatus(statusData.status || "Pending");
			const listData = await listRes.json();
			setModalComplaints(Array.isArray(listData) ? listData : []);
		} catch (e) {
			console.error(e);
		}
	};

	const saveModalStatus = async () => {
		if (!modal) return;
		try {
			await fetch(
				`${API_BASE}/${modal.module}/area-status/${encodeURIComponent(
					modal.city
				)}/${encodeURIComponent(modal.area)}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ status: modalStatus }),
				}
			);
			alert("Saved!");
			setModal(null);
		} catch {
			alert("Failed to save");
		}
	};

	const resolveAll = async () => {
		if (!modal || !window.confirm("Permanently remove all complaints?"))
			return;
		try {
			const r = await fetch(
				`${API_BASE}/${modal.module}/area-resolve/${encodeURIComponent(
					modal.city
				)}/${encodeURIComponent(modal.area)}`,
				{ method: "POST" }
			);
			const d = await r.json();
			alert(`Removed ${d.removed_count} complaints.`);
			setModal(null);
			loadHomeData();
		} catch {
			alert("Error resolving");
		}
	};

	const resolveIndividual = async (id) => {
		if (!window.confirm(`Mark report ${id} as resolved?`)) return;
		try {
			const r = await fetch(
				`${BASE}/dashboard/complaint/${encodeURIComponent(id)}/resolve`,
				{ method: "POST" }
			);
			if (r.ok) {
				alert("Resolved successfully.");
				setDetailModal(null);
				loadHomeData();
				if (activeModule === "road") loadRoadData();
				if (activeModule === "health") loadHealthData();
				if (activeModule === "fraud") loadFraudData();
			} else {
				alert("Failed to resolve");
			}
		} catch (e) {
			console.error(e);
			alert("Error connecting to server");
		}
	};

	// Logout
	const handleLogout = () => {
		localStorage.clear();
		navigate("/signin");
	};

	// --- Effects ---
	useEffect(() => {
		checkApi();
		loadHomeData();
		const apiInterval = setInterval(checkApi, 5000);
		const dataInterval = setInterval(() => {
			if (activeModule === "home") loadHomeData();
			if (activeModule === "road") loadRoadData();
			if (activeModule === "health") loadHealthData();
			if (activeModule === "fraud") loadFraudData();
		}, 10000);
		return () => {
			clearInterval(apiInterval);
			clearInterval(dataInterval);
		};
	}, [
		activeModule,
		checkApi,
		loadHomeData,
		loadRoadData,
		loadHealthData,
		loadFraudData,
	]);

	useEffect(() => {
		if (activeModule === "road") loadRoadData();
		if (activeModule === "health") loadHealthData();
		if (activeModule === "fraud") loadFraudData();
		if (activeModule === "home") loadHomeData();
	}, [activeModule, loadRoadData, loadHealthData, loadFraudData, loadHomeData]);

	// --- Chart Configs ---
	const lineChartData = stats?.trends
		? {
				labels: stats.trends.labels,
				datasets: [
					{
						label: "Road",
						data: stats.trends.road,
						borderColor: "#3b82f6",
						backgroundColor: "rgba(59,130,246,0.08)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
						borderWidth: 2,
					},
					{
						label: "Health",
						data: stats.trends.health,
						borderColor: "#10b981",
						backgroundColor: "rgba(16,185,129,0.08)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
						borderWidth: 2,
					},
					{
						label: "Fraud",
						data: stats.trends.fraud,
						borderColor: "#ef4444",
						backgroundColor: "rgba(239,68,68,0.08)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
						borderWidth: 2,
					},
				],
		  }
		: null;

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					color: "#64748b",
					boxWidth: 8,
					usePointStyle: true,
					padding: 20,
					font: { size: 11, weight: "600" },
				},
			},
			tooltip: {
				backgroundColor: "#0b1629",
				padding: 12,
				cornerRadius: 12,
				borderColor: "rgba(255,255,255,0.1)",
				borderWidth: 1,
				titleColor: "#94a3b8",
				bodyColor: "#f0f6ff",
			},
		},
		scales: {
			y: {
				grid: { color: "rgba(255,255,255,0.03)" },
				ticks: { color: "#64748b", padding: 10, font: { size: 11 } },
				border: { display: false },
			},
			x: {
				grid: { display: false },
				ticks: { color: "#64748b", font: { size: 11 } },
				border: { display: false },
			},
		},
	};

	const makeBarData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				label: "Complaints",
				data: entries.map((e) => e[1]),
				backgroundColor: `${color}99`,
				hoverBackgroundColor: color,
				borderRadius: 8,
				borderSkipped: false,
			},
		],
	});

	const barOptions = (onClick) => ({
		indexAxis: "y",
		responsive: true,
		maintainAspectRatio: false,
		onClick: (e, elements) => {
			if (onClick && elements.length > 0) {
				const idx = elements[0].index;
				onClick(idx);
			}
		},
		plugins: {
			legend: { display: false },
			tooltip: {
				backgroundColor: "#0b1629",
				padding: 12,
				cornerRadius: 12,
				borderColor: "rgba(255,255,255,0.1)",
				borderWidth: 1,
			},
		},
		scales: {
			y: {
				grid: { display: false },
				ticks: { color: "#64748b", padding: 10, font: { size: 11 } },
				border: { display: false },
			},
			x: {
				grid: { color: "rgba(255,255,255,0.03)" },
				ticks: { color: "#64748b", font: { size: 11 } },
				border: { display: false },
			},
		},
	});

	const makeDoughnutData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				data: entries.map((e) => e[1]),
				backgroundColor: entries.map(
					(_, i) => `${color}${(0xee - i * 0x20).toString(16).padStart(2, "0")}`
				),
				borderColor: "#0b1629",
				borderWidth: 3,
				hoverOffset: 6,
			},
		],
	});

	const makePolarData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				data: entries.map((e) => e[1]),
				backgroundColor: entries.map(
					(_, i) => `${color}${(0xee - i * 0x20).toString(16).padStart(2, "0")}`
				),
				borderColor: "#0b1629",
				borderWidth: 2,
			},
		],
	});

	const circularOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: { color: "#64748b", boxWidth: 10, font: { size: 11 } },
			},
			tooltip: {
				backgroundColor: "#0b1629",
				padding: 12,
				cornerRadius: 12,
				borderColor: "rgba(255,255,255,0.1)",
				borderWidth: 1,
			},
		},
	};

	const polarOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: { color: "#64748b", boxWidth: 10, font: { size: 11 } },
			},
			tooltip: {
				backgroundColor: "#0b1629",
				padding: 12,
				cornerRadius: 12,
				borderColor: "rgba(255,255,255,0.1)",
				borderWidth: 1,
			},
		},
		scales: {
			r: {
				grid: { color: "rgba(255,255,255,0.05)" },
				ticks: { backdropColor: "transparent", color: "#64748b" },
			},
		},
	};

	// Nav config
	const navItems = [
		{ key: "home",    label: "Overview",          icon: LayoutDashboard },
		{ key: "road",    label: "Road Complaints",    icon: Construction },
		{ key: "health",  label: "Health Complaints",  icon: Stethoscope },
		{ key: "fraud",   label: "Banking Fraud",      icon: CreditCard },
		{ key: "schemes", label: "Scheme Management",  icon: BookOpen },
	];

	// Module labels for topbar
	const moduleLabel = {
		home:    { title: "Dashboard Overview",  sub: "Real-time analytics" },
		road:    { title: "Road Complaints",      sub: "Infrastructure monitoring" },
		health:  { title: "Health Complaints",    sub: "Public health tracking" },
		fraud:   { title: "Banking Fraud",        sub: "Financial security" },
		schemes: { title: "Scheme Management",    sub: "Government schemes" },
	};

	const initials = [user.firstname?.[0], user.lastname?.[0]].filter(Boolean).join("") || "A";

	return (
		<>
			<div className="gov-dash">
				{/* Mobile sidebar overlay */}
				<div
					className={`gov-sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
					onClick={() => setSidebarOpen(false)}
				/>

				{/* ── SIDEBAR ─────────────────────────────────────── */}
				<aside className={`gov-sidebar ${sidebarOpen ? "mob-open" : ""}`}>
					{/* Brand */}
					<div className="gov-brand">
						<div className="gov-logo">G</div>
						<div>
							<div className="gov-brand-name">GovSecAI</div>
							<div className="gov-brand-sub">Admin Console</div>
						</div>
					</div>

					{/* Navigation */}
					<nav className="gov-nav">
						<div className="gov-nav-label">Main Menu</div>
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.key}
									className={`gov-nav-btn ${activeModule === item.key ? "active" : ""}`}
									onClick={() => {
										setActiveModule(item.key);
										setSidebarOpen(false); // close on mobile after selection
									}}
								>
									<Icon size={17} className="gov-nav-icon" />
									{item.label}
								</button>
							);
						})}
					</nav>

					{/* User Info */}
					<div className="gov-user-box">
						<div className="gov-user-info">
							<div className="gov-user-avatar">{initials}</div>
							<div style={{ minWidth: 0 }}>
								<div className="gov-user-name">
									{user.firstname} {user.lastname}
								</div>
								<div className="gov-user-role">Gov. Official</div>
							</div>
						</div>
						<button className="gov-logout-btn" onClick={handleLogout}>
							<LogOut size={12} />
							Sign Out
						</button>
					</div>

					{/* API Status */}
					<div className="gov-status">
						<div className="gov-status-label">System Status</div>
						<div
							className="gov-pill"
							style={{
								background: apiOnline
									? "rgba(14,215,178,0.12)"
									: "rgba(239,68,68,0.1)",
								color: apiOnline ? "#0ed7b2" : "#ef4444",
								border: `1px solid ${apiOnline ? "rgba(14,215,178,0.2)" : "rgba(239,68,68,0.2)"}`,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: apiOnline ? "#0ed7b2" : "#ef4444",
									display: "inline-block",
									boxShadow: apiOnline ? "0 0 6px #0ed7b2" : "0 0 6px #ef4444",
									animation: apiOnline ? "govPulse 2s infinite" : "none",
								}}
							/>
							{apiStatus}
						</div>
					</div>
				</aside>

				{/* ── CONTENT AREA ────────────────────────────────── */}
				<div className="gov-content-area">
					{/* Top bar */}
					<header className="gov-topbar">
						<div className="gov-topbar-left">
							{/* Hamburger — visible only on tablet/mobile via CSS */}
							<button
								className="gov-hamburger"
								onClick={() => setSidebarOpen((p) => !p)}
								aria-label="Toggle menu"
							>
								{sidebarOpen ? <X size={18} /> : <Menu size={18} />}
							</button>
							<div>
								<div className="gov-topbar-title">{moduleLabel[activeModule]?.title}</div>
								<div className="gov-topbar-breadcrumb">
									GovSecAI
									<ChevronRight size={12} />
									{moduleLabel[activeModule]?.sub}
								</div>
							</div>
						</div>
						<div className="gov-topbar-actions">
							<div className="gov-live-badge">
								<span className="gov-live-dot" />
								<span className="gov-live-badge-text">Live Data</span>
							</div>
							<button className="gov-icon-btn" onClick={loadHomeData} title="Refresh">
								<RefreshCw size={15} />
							</button>
							<button className="gov-icon-btn" title="Notifications" onClick={() => navigate("/notifications")}>
								<Bell size={15} />
							</button>
						</div>
					</header>

					{/* Main scrollable area */}
					<main className="gov-main">

						{/* ── HOME ─────────────────────────────────── */}
						{activeModule === "home" && (
							<div className="gov-panel">
								{/* Stat Cards */}
								<div className="gov-home-grid">
									{/* Road */}
									<div className="gov-stat-card road">
										<div className="gov-stat-header">
											<div>
												<div className="gov-stat-title">Road Complaints</div>
												<div className="gov-stat-value">
													{stats?.counts?.road?.toLocaleString() ?? "—"}
												</div>
											</div>
											<div
												className="gov-stat-icon-wrap"
												style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
											>
												<Construction size={22} color="#3b82f6" />
											</div>
										</div>
										<div style={{ fontSize: 12, color: "var(--text-muted)" }}>
											Infrastructure reports
										</div>
									</div>

									{/* Health */}
									<div className="gov-stat-card health">
										<div className="gov-stat-header">
											<div>
												<div className="gov-stat-title">Health Complaints</div>
												<div className="gov-stat-value">
													{stats?.counts?.health?.toLocaleString() ?? "—"}
												</div>
											</div>
											<div
												className="gov-stat-icon-wrap"
												style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
											>
												<Stethoscope size={22} color="#10b981" />
											</div>
										</div>
										<div style={{ fontSize: 12, color: "var(--text-muted)" }}>
											Sanitation & health reports
										</div>
									</div>

									{/* Fraud */}
									<div className="gov-stat-card fraud">
										<div className="gov-stat-header">
											<div>
												<div className="gov-stat-title">Banking Fraud</div>
												<div className="gov-stat-value">
													{stats?.counts?.fraud?.toLocaleString() ?? "—"}
												</div>
											</div>
											<div
												className="gov-stat-icon-wrap"
												style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}
											>
												<AlertTriangle size={22} color="#ef4444" />
											</div>
										</div>
										<div style={{ fontSize: 12, color: "var(--text-muted)" }}>
											Financial anomaly reports
										</div>
									</div>

									{/* Total */}
									<div className="gov-stat-card total">
										<div className="gov-stat-header">
											<div>
												<div className="gov-stat-title">Total Incidents</div>
												<div className="gov-stat-value">
													{stats?.counts?.total?.toLocaleString() ?? "—"}
												</div>
											</div>
											<div
												className="gov-stat-icon-wrap"
												style={{ background: "rgba(14,215,178,0.12)", border: "1px solid rgba(14,215,178,0.2)" }}
											>
												<Activity size={22} color="#0ed7b2" />
											</div>
										</div>
										<div style={{ fontSize: 12, color: "var(--text-muted)" }}>
											All active reports
										</div>
									</div>

									{/* Trend Chart - span 2 cols */}
									<div className="gov-card" style={{ gridColumn: "span 2" }}>
										<h3 className="gov-h3">
											<TrendingUp size={14} style={{ opacity: 0.6 }} />
											Complaint Trends
										</h3>
										<div className="gov-chart-container">
											{lineChartData && (
												<Line data={lineChartData} options={chartOptions} />
											)}
										</div>
									</div>

									{/* Live Alerts - span 2 cols */}
									<div className="gov-card" style={{ gridColumn: "span 2" }}>
										<h3 className="gov-h3">
											<Bell size={14} style={{ opacity: 0.6 }} />
											Live Alerts
										</h3>
										<div className="gov-alerts-list">
											{stats?.alerts?.length === 0 && (
												<div className="gov-empty">
													<div className="gov-empty-icon">🔔</div>
													<div>No active alerts</div>
												</div>
											)}
											{stats?.alerts?.map((a, i) => {
												const imgUrl = getFullImageUrl(a.evidence_url);
												return (
													<div key={i} className="gov-alert-item">
														{imgUrl && (
															<img
																src={imgUrl}
																alt="Evidence"
																className="gov-alert-thumbnail"
																onClick={() => setLightboxImg(imgUrl)}
															/>
														)}
														<div className="gov-alert-body">
															<div className="gov-alert-meta">
																<span className={`gov-tag ${a.source}`}>{a.source}</span>
																<span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
																	<Calendar size={11} />
																	{a.date}
																</span>
															</div>
															<div className="gov-alert-desc">
																{a.description?.substring(0, 130)}
															</div>
															<div className="gov-alert-location">
																<MapPin size={11} />
																{a.city}
															</div>
															<div className="gov-alert-actions">
																<button
																	className="gov-btn-small primary"
																	onClick={() => setDetailModal(a)}
																>
																	<Eye size={11} />
																	View Report
																</button>
																<button
																	className="gov-btn-small resolve"
																	onClick={() => resolveIndividual(a.id)}
																>
																	<CheckCircle2 size={11} />
																	Resolve
																</button>
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── ROAD ─────────────────────────────────── */}
						{activeModule === "road" && (
							<div className="gov-panel">
								<div className="gov-split">
									{/* Charts */}
									<div className="gov-charts-col">
										<div className="gov-card">
											<h3 className="gov-h3">Top Cities — Road Complaints</h3>
											<div className="gov-chart-container-main">
												{roadCities.length > 0 ? (
													<Bar
														data={makeBarData(roadCities.slice(0, 10), "#3b82f6")}
														options={barOptions((idx) => loadRoadAreas(roadCities[idx][0]))}
													/>
												) : (
													<div className="gov-empty"><div className="gov-empty-icon">📊</div><div>No data</div></div>
												)}
											</div>
										</div>
										{roadAreas.length > 0 && (
											<div className="gov-card">
												<h3 className="gov-h3">Top Areas — {selectedRoadCity}</h3>
												<div className="gov-chart-container-areas">
													<Bar
														data={makeBarData(roadAreas, "#3b82f6")}
														options={barOptions((idx) =>
															openModal("road", selectedRoadCity, roadAreas[idx][0], roadAreas[idx][1])
														)}
													/>
												</div>
											</div>
										)}
									</div>

									{/* City List */}
									<div className="gov-card gov-list-col">
										<h3 className="gov-h3">Cities</h3>
										<div className="gov-item-list">
											{roadCities.map(([city, count]) => (
												<div
													key={city}
													className="gov-list-item"
													onClick={() => loadRoadAreas(city)}
												>
													<span className="gov-list-item-name">{city}</span>
													<span className="gov-list-item-count">{count.toLocaleString()}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── HEALTH ───────────────────────────────── */}
						{activeModule === "health" && (
							<div className="gov-panel">
								<div className="gov-split">
									<div className="gov-charts-col">
										<div className="gov-card">
											<h3 className="gov-h3">Sanitation Distribution</h3>
											<div className="gov-chart-container-main" style={{ height: 350 }}>
												{healthCities.length > 0 ? (
													<Doughnut
														data={makeDoughnutData(healthCities.slice(0, 10), "#10b981")}
														options={circularOptions}
													/>
												) : (
													<div className="gov-empty"><div className="gov-empty-icon">💊</div><div>No data</div></div>
												)}
											</div>
										</div>
										{healthAreas.length > 0 && (
											<div className="gov-card">
												<h3 className="gov-h3">Top Areas — {selectedHealthCity}</h3>
												<div className="gov-chart-container-areas">
													<Bar
														data={makeBarData(healthAreas, "#10b981")}
														options={barOptions((idx) =>
															openModal("health", selectedHealthCity, healthAreas[idx][0], healthAreas[idx][1])
														)}
													/>
												</div>
											</div>
										)}
									</div>
									<div className="gov-card gov-list-col">
										<h3 className="gov-h3">Cities</h3>
										<div className="gov-item-list">
											{healthCities.map(([city, count]) => (
												<div
													key={city}
													className="gov-list-item"
													onClick={() => loadHealthAreas(city)}
												>
													<span className="gov-list-item-name">{city}</span>
													<span className="gov-list-item-count">{count.toLocaleString()}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── FRAUD ────────────────────────────────── */}
						{activeModule === "fraud" && (
							<div className="gov-panel">
								<div className="gov-split">
									<div className="gov-charts-col">
										<div className="gov-card">
											<h3 className="gov-h3">Fraud Security Map</h3>
											<div className="gov-chart-container-main" style={{ height: 350 }}>
												{fraudCities.length > 0 ? (
													<PolarArea
														data={makePolarData(fraudCities.slice(0, 10), "#ef4444")}
														options={polarOptions}
													/>
												) : (
													<div className="gov-empty"><div className="gov-empty-icon">🛡️</div><div>No data</div></div>
												)}
											</div>
										</div>
										{fraudAreas.length > 0 && (
											<div className="gov-card">
												<h3 className="gov-h3">Top Fraud Areas — {selectedFraudCity}</h3>
												<div className="gov-chart-container-areas">
													<Bar
														data={makeBarData(fraudAreas, "#ef4444")}
														options={barOptions((idx) =>
															openModal("fraud", selectedFraudCity, fraudAreas[idx][0], fraudAreas[idx][1])
														)}
													/>
												</div>
											</div>
										)}
									</div>
									<div className="gov-card gov-list-col">
										<h3 className="gov-h3">Cities</h3>
										<div className="gov-item-list">
											{fraudCities.map(([city, count]) => (
												<div
													key={city}
													className="gov-list-item"
													onClick={() => loadFraudAreas(city)}
												>
													<span className="gov-list-item-name">{city}</span>
													<span className="gov-list-item-count">{count.toLocaleString()}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* ── SCHEMES ──────────────────────────────── */}
						{activeModule === "schemes" && (
							<div className="gov-panel">
								<AdminSchemesPanel />
							</div>
						)}
					</main>
				</div>
			</div>

			{/* ── AREA STATUS MODAL ──────────────────────── */}
			{modal && (
				<div
					className="gov-modal-overlay"
					onClick={(e) => e.target === e.currentTarget && setModal(null)}
				>
					<div className="gov-modal">
						<div className="gov-modal-header">
							<div>
								<div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Area Status</div>
								<div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
									{modal.city} · {modal.area}
								</div>
							</div>
							<button className="gov-modal-close" onClick={() => setModal(null)}>×</button>
						</div>

						<div className="gov-modal-row">
							<span className="gov-muted">City</span>
							<span style={{ fontWeight: 700 }}>{modal.city}</span>
						</div>
						<div className="gov-modal-row">
							<span className="gov-muted">Area</span>
							<span style={{ fontWeight: 700 }}>{modal.area}</span>
						</div>
						<div className="gov-modal-row">
							<span className="gov-muted">Total Complaints</span>
							<span
								style={{
									fontWeight: 800,
									fontSize: 18,
									color: "#0ed7b2",
								}}
							>
								{modal.count}
							</span>
						</div>

						{/* Complaints List */}
						{modalComplaints.length > 0 && (
							<div
								style={{
									maxHeight: 240,
									overflowY: "auto",
									borderTop: "1px solid rgba(255,255,255,0.06)",
									paddingTop: 14,
									marginTop: 16,
									marginBottom: 16,
								}}
							>
								<h4 className="gov-h3" style={{ fontSize: 10 }}>
									Submissions ({modalComplaints.length})
								</h4>
								{modalComplaints.map((item, i) => (
									<div key={i} className="gov-complaint-item">
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												marginBottom: 6,
											}}
										>
											<span style={{ fontWeight: 700, color: "#3b82f6", fontSize: 12 }}>
												{item.complaint_id || item.transaction_id}
											</span>
											<span
												className="gov-pill"
												style={{
													background: "rgba(14,215,178,0.1)",
													color: "#0ed7b2",
													fontSize: 10,
												}}
											>
												{modal.module === "fraud"
													? `Risk: ${item.risk_score}%`
													: `AI: ${item.status || "Verified"}`}
											</span>
										</div>
										<div className="gov-muted" style={{ fontSize: 12 }}>
											{item.description || item.complaint_text || "No description"}
										</div>
										{item.evidence_url && (
											<img
												src={getFullImageUrl(item.evidence_url)}
												alt="Evidence"
												style={{
													width: "100%",
													borderRadius: 8,
													marginTop: 8,
													cursor: "pointer",
													border: "1px solid rgba(255,255,255,0.08)",
												}}
												onClick={() =>
													setLightboxImg(getFullImageUrl(item.evidence_url))
												}
											/>
										)}
									</div>
								))}
							</div>
						)}

						{/* Status Buttons */}
						<div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 8 }}>
							Update Status
						</div>
						<div className="gov-status-btns">
							{["Pending", "Processing", "Resolved"].map((s) => (
								<button
									key={s}
									className={`gov-status-btn ${modalStatus === s ? "active" : ""}`}
									data-status={s}
									onClick={() => setModalStatus(s)}
								>
									{s}
								</button>
							))}
						</div>

						<div className="gov-modal-actions">
							<button className="gov-btn gov-btn-danger" onClick={resolveAll}>
								Resolve All
							</button>
							<button className="gov-btn gov-btn-save" onClick={saveModalStatus}>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── DETAIL MODAL ───────────────────────────── */}
			{detailModal && (
				<div
					className="gov-modal-overlay"
					onClick={(e) => e.target === e.currentTarget && setDetailModal(null)}
				>
					<div className="gov-modal" style={{ maxWidth: 520 }}>
						<div className="gov-modal-header">
							<div>
								<div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
									Detailed Report
								</div>
								<span className={`gov-tag ${detailModal.source}`}>{detailModal.source}</span>
							</div>
							<button className="gov-modal-close" onClick={() => setDetailModal(null)}>×</button>
						</div>

						<div style={{ marginBottom: 20 }}>
							<div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.5 }}>
								{detailModal.description}
							</div>
							<div
								className="gov-pill"
								style={{
									background: "rgba(255,255,255,0.04)",
									color: "var(--text-muted)",
									border: "1px solid rgba(255,255,255,0.08)",
									fontSize: 11,
								}}
							>
								ID: {detailModal.id}
							</div>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 14,
								marginBottom: 24,
							}}
						>
							<div
								style={{
									padding: 14,
									background: "rgba(255,255,255,0.02)",
									borderRadius: 12,
									border: "1px solid rgba(255,255,255,0.05)",
								}}
							>
								<div
									style={{
										fontSize: 10,
										textTransform: "uppercase",
										letterSpacing: 1,
										color: "var(--text-muted)",
										marginBottom: 4,
									}}
								>
									Location
								</div>
								<div style={{ fontWeight: 700, fontSize: 14 }}>
									{detailModal.area ? `${detailModal.area}, ` : ""}
									{detailModal.city}
								</div>
							</div>
							<div
								style={{
									padding: 14,
									background: "rgba(255,255,255,0.02)",
									borderRadius: 12,
									border: "1px solid rgba(255,255,255,0.05)",
								}}
							>
								<div
									style={{
										fontSize: 10,
										textTransform: "uppercase",
										letterSpacing: 1,
										color: "var(--text-muted)",
										marginBottom: 4,
									}}
								>
									Date Reported
								</div>
								<div style={{ fontWeight: 700, fontSize: 14 }}>{detailModal.date}</div>
							</div>
						</div>

						{detailModal.evidence_url && (
							<div style={{ marginBottom: 24 }}>
								<div
									style={{
										fontSize: 10,
										textTransform: "uppercase",
										letterSpacing: 1,
										color: "var(--text-muted)",
										marginBottom: 10,
									}}
								>
									Evidence Attachment
								</div>
								<img
									src={getFullImageUrl(detailModal.evidence_url)}
									alt="Evidence"
									style={{
										width: "100%",
										borderRadius: 14,
										cursor: "pointer",
										border: "1px solid rgba(255,255,255,0.1)",
										transition: "transform 0.2s",
									}}
									onClick={() =>
										setLightboxImg(getFullImageUrl(detailModal.evidence_url))
									}
									onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
									onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
								/>
							</div>
						)}

						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								paddingTop: 20,
								borderTop: "1px solid rgba(255,255,255,0.06)",
							}}
						>
							<button
								className="gov-btn"
								style={{
									background: "rgba(16,185,129,0.15)",
									color: "#10b981",
									border: "1px solid rgba(16,185,129,0.25)",
								}}
								onClick={() => resolveIndividual(detailModal.id)}
							>
								<CheckCircle2 size={15} />
								Confirm Resolution
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── LIGHTBOX ───────────────────────────────── */}
			{lightboxImg && (
				<div className="gov-lightbox" onClick={() => setLightboxImg(null)}>
					<img src={lightboxImg} alt="Enlarged Evidence" />
				</div>
			)}
		</>
	);
};

export default GovDashboard;
