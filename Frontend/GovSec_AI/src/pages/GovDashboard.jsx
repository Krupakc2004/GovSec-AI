import React, { useState, useEffect, useCallback, useRef } from "react";
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

const GovDashboard = () => {
	const navigate = useNavigate();
	const [activeModule, setActiveModule] = useState("home");
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
	const userStr = sessionStorage.getItem("govsec_user");
	const user = userStr ? JSON.parse(userStr) : {};

	// --- API Check ---
	const checkApi = useCallback(async () => {
		try {
			const r = await fetch(`${API_BASE}/ping`);
			const j = await r.json();
			if (j.status === "ok") {
				setApiStatus("● Online");
				setApiOnline(true);
			}
		} catch {
			setApiStatus("● Offline");
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
				// Also refresh active module data if needed
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
		sessionStorage.clear();
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
						backgroundColor: "rgba(59,130,246,0.1)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
					},
					{
						label: "Health",
						data: stats.trends.health,
						borderColor: "#10b981",
						backgroundColor: "rgba(16,185,129,0.1)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
					},
					{
						label: "Fraud",
						data: stats.trends.fraud,
						borderColor: "#ef4444",
						backgroundColor: "rgba(239,68,68,0.1)",
						fill: true,
						tension: 0.4,
						pointRadius: 0,
						pointHoverRadius: 6,
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
					color: "#94a3b8",
					boxWidth: 8,
					usePointStyle: true,
					padding: 20,
				},
			},
			tooltip: {
				backgroundColor: "#1e293b",
				padding: 12,
				cornerRadius: 10,
				borderColor: "rgba(255,255,255,0.1)",
				borderWidth: 1,
			},
		},
		scales: {
			y: {
				grid: { color: "rgba(255,255,255,0.03)" },
				ticks: { color: "#94a3b8", padding: 10 },
			},
			x: {
				grid: { display: false },
				ticks: { color: "#94a3b8" },
			},
		},
	};

	const makeBarData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				label: "Complaints",
				data: entries.map((e) => e[1]),
				backgroundColor: color,
				borderRadius: 6,
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
				backgroundColor: "#1e293b",
				padding: 12,
				cornerRadius: 10,
			},
		},
		scales: {
			y: {
				grid: { display: false },
				ticks: { color: "#94a3b8", padding: 10, font: { size: 11 } },
			},
			x: {
				grid: { color: "rgba(255,255,255,0.03)" },
				ticks: { color: "#94a3b8" },
			},
		},
	});

	const makeDoughnutData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				data: entries.map((e) => e[1]),
				backgroundColor: entries.map(
					(_, i) => `${color}${(0xee - i * 0x22).toString(16).padStart(2, "0")}`
				),
				borderColor: "#020617",
				borderWidth: 2,
			},
		],
	});

	const makePolarData = (entries, color) => ({
		labels: entries.map((e) => e[0]),
		datasets: [
			{
				data: entries.map((e) => e[1]),
				backgroundColor: entries.map(
					(_, i) => `${color}${(0xee - i * 0x22).toString(16).padStart(2, "0")}`
				),
				borderColor: "#020617",
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
				labels: { color: "#94a3b8", boxWidth: 10, font: { size: 10 } },
			},
		},
	};

	const polarOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "right",
				labels: { color: "#94a3b8", boxWidth: 10, font: { size: 10 } },
			},
		},
		scales: {
			r: {
				grid: { color: "rgba(255,255,255,0.05)" },
				ticks: { backdropColor: "transparent", color: "#64748b" },
			},
		},
	};

	// Nav items
	const navItems = [
		{ key: "home", label: "Home Overview" },
		{ key: "road", label: "Road Complaints" },
		{ key: "health", label: "Health Complaints" },
		{ key: "fraud", label: "Banking Fraud" },
		{ key: "schemes", label: "Scheme Management" },
	];

	return (
		<>
			<div className="gov-dash">
				{/* Sidebar */}
				<aside className="gov-sidebar">
					<div className="gov-brand">
						<div className="gov-logo">G</div>
						<div>
							<div style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
								GovSecAI
							</div>
							<div className="gov-muted" style={{ fontSize: 12 }}>
								Premium Dashboard
							</div>
						</div>
					</div>

					<nav className="gov-nav">
						{navItems.map((item) => (
							<button
								key={item.key}
								className={`gov-nav-btn ${activeModule === item.key ? "active" : ""}`}
								onClick={() => setActiveModule(item.key)}
							>
								{item.label}
							</button>
						))}
					</nav>

					{/* User Info */}
					<div className="gov-user-box">
						<div className="gov-user-name">
							{user.firstname} {user.lastname}
						</div>
						<div className="gov-user-role">Government Official</div>
						<button className="gov-logout-btn" onClick={handleLogout}>
							Logout
						</button>
					</div>

					{/* API Status */}
					<div className="gov-status">
						<div className="gov-muted" style={{ fontSize: 11, marginBottom: 6 }}>
							SYSTEM STATUS
						</div>
						<div
							className="gov-pill"
							style={{
								background: apiOnline
									? "rgba(14,215,178,0.2)"
									: "rgba(239,68,68,0.1)",
								color: apiOnline ? "#0ed7b2" : "#ef4444",
							}}
						>
							{apiStatus}
						</div>
					</div>
				</aside>

				{/* Main */}
				<main className="gov-main">
					{/* HOME */}
					{activeModule === "home" && (
						<div className="gov-panel">
							<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
								<div>
									<h2 className="gov-h2">Dashboard Overview</h2>
									<div className="gov-muted">Real-time analytics and system monitoring</div>
								</div>
								<div className="gov-pill" style={{ background: "rgba(255,255,255,0.1)" }}>Live Data</div>
							</div>

							<div className="gov-home-grid">
								<div className="gov-stat-card">
									<div className="gov-stat-title">Road Complaints</div>
									<div className="gov-stat-value">{stats?.counts?.road?.toLocaleString() || "-"}</div>
								</div>
								<div className="gov-stat-card">
									<div className="gov-stat-title">Health Complaints</div>
									<div className="gov-stat-value">{stats?.counts?.health?.toLocaleString() || "-"}</div>
								</div>
								<div className="gov-stat-card">
									<div className="gov-stat-title">Banking Fraud</div>
									<div className="gov-stat-value">{stats?.counts?.fraud?.toLocaleString() || "-"}</div>
								</div>
								<div className="gov-stat-card total">
									<div className="gov-stat-title">Total Incidents</div>
									<div className="gov-stat-value">{stats?.counts?.total?.toLocaleString() || "-"}</div>
								</div>

								{/* Chart */}
								<div className="gov-card" style={{ gridColumn: "span 2" }}>
									<h3 className="gov-h3">Complaint Trends</h3>
									<div className="gov-chart-container">
										{lineChartData && (
											<Line data={lineChartData} options={chartOptions} />
										)}
									</div>
								</div>

								{/* Alerts */}
								<div className="gov-card" style={{ gridColumn: "span 2" }}>
									<h3 className="gov-h3">Live Alerts</h3>
									<div className="gov-alerts-list">
										{stats?.alerts?.map((a, i) => (
											<div key={i} className="gov-alert-item">
												<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>
													<span className={`gov-tag ${a.source}`}>{a.source}</span>
													<span>{a.date}</span>
												</div>
												<div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5 }}>
													{a.description?.substring(0, 120)}
												</div>
												<div className="gov-muted" style={{ fontSize: "0.75rem", marginTop: 8, opacity: 0.8 }}>
													{a.city}
												</div>
												<div className="gov-alert-actions">
													<button 
														className="gov-btn-small primary"
														onClick={() => setDetailModal(a)}
													>
														View Report
													</button>
													<button 
														className="gov-btn-small resolve"
														onClick={() => resolveIndividual(a.id)}
													>
														Mark Resolved
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* ROAD */}
					{activeModule === "road" && (
						<div className="gov-panel">
							<div>
								<h2 className="gov-h2">Road Complaints</h2>
								<div className="gov-muted">Infrastructure and maintenance tracking</div>
							</div>
							<div className="gov-split">
								<div className="gov-charts-col">
									<div className="gov-card">
										<h3 className="gov-h3">Complaint Distribution (Top Cities)</h3>
										<div className="gov-chart-container-main">
											{roadCities.length > 0 && (
												<Bar
													data={makeBarData(roadCities.slice(0, 10), "#3b82f6")}
													options={barOptions((idx) => loadRoadAreas(roadCities[idx][0]))}
												/>
											)}
										</div>
									</div>
									{roadAreas.length > 0 && (
										<div className="gov-card">
											<h3 className="gov-h3">Top 15 Impacted Areas — {selectedRoadCity}</h3>
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
								<div className="gov-card gov-list-col">
									<h3 className="gov-h3">Cities List</h3>
									<div className="gov-item-list">
										{roadCities.map(([city, count]) => (
											<div key={city} className="gov-list-item" onClick={() => loadRoadAreas(city)}>
												<span>{city}</span>
												<span className="gov-muted">{count.toLocaleString()}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* HEALTH */}
					{activeModule === "health" && (
						<div className="gov-panel">
							<div>
								<h2 className="gov-h2">Health Complaints</h2>
								<div className="gov-muted">Public health and sanitation monitoring</div>
							</div>
							<div className="gov-split">
								<div className="gov-charts-col">
									<div className="gov-card">
										<h3 className="gov-h3">Sanitation Distribution</h3>
										<div className="gov-chart-container-main" style={{ height: 350 }}>
											{healthCities.length > 0 && (
												<Doughnut
													data={makeDoughnutData(healthCities.slice(0, 10), "#10b981")}
													options={circularOptions}
												/>
											)}
										</div>
									</div>
									{healthAreas.length > 0 && (
										<div className="gov-card">
											<h3 className="gov-h3">Top 15 Impacted Areas — {selectedHealthCity}</h3>
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
									<h3 className="gov-h3">Cities List</h3>
									<div className="gov-item-list">
										{healthCities.map(([city, count]) => (
											<div key={city} className="gov-list-item" onClick={() => loadHealthAreas(city)}>
												<span>{city}</span>
												<span className="gov-muted">{count.toLocaleString()}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* FRAUD */}
					{activeModule === "fraud" && (
						<div className="gov-panel">
							<div>
								<h2 className="gov-h2">Banking Fraud</h2>
								<div className="gov-muted">Financial security and fraud detection</div>
							</div>
							<div className="gov-split">
								<div className="gov-charts-col">
									<div className="gov-card">
										<h3 className="gov-h3">Fraud Security Map</h3>
										<div className="gov-chart-container-main" style={{ height: 350 }}>
											{fraudCities.length > 0 && (
												<PolarArea
													data={makePolarData(fraudCities.slice(0, 10), "#ef4444")}
													options={polarOptions}
												/>
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
									<h3 className="gov-h3">Cities List</h3>
									<div className="gov-item-list">
										{fraudCities.map(([city, count]) => (
											<div key={city} className="gov-list-item" onClick={() => loadFraudAreas(city)}>
												<span>{city}</span>
												<span className="gov-muted">{count.toLocaleString()}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* SCHEMES */}
					{activeModule === "schemes" && (
						<div className="gov-panel">
							<AdminSchemesPanel />
						</div>
					)}
				</main>
			</div>

			{/* Area Status Modal */}
			{modal && (
				<div className="gov-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
					<div className="gov-modal">
						<div className="gov-modal-header">
							<h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Area Status</h3>
							<button className="gov-modal-close" onClick={() => setModal(null)}>×</button>
						</div>

						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span className="gov-muted">City</span>
							<span style={{ fontWeight: 700 }}>{modal.city}</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
							<span className="gov-muted">Area</span>
							<span style={{ fontWeight: 700 }}>{modal.area}</span>
						</div>
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
							<span className="gov-muted">Complaints</span>
							<span>{modal.count}</span>
						</div>

						{/* Complaints List */}
						{modalComplaints.length > 0 && (
							<div style={{ maxHeight: 250, overflowY: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14, marginBottom: 16 }}>
								<h4 className="gov-h3" style={{ fontSize: 12 }}>Individual Submissions ({modalComplaints.length})</h4>
								{modalComplaints.map((item, i) => (
									<div key={i} className="gov-complaint-item">
										<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
											<span style={{ fontWeight: 600, color: "#3b82f6" }}>
												{item.complaint_id || item.transaction_id}
											</span>
											<span className="gov-pill" style={{ background: "rgba(14,215,178,0.2)", color: "#0ed7b2", fontSize: 10 }}>
												{modal.module === "fraud" ? `Risk: ${item.risk_score}%` : `AI: ${item.status || "Verified"}`}
											</span>
										</div>
										<div className="gov-muted" style={{ fontSize: 12 }}>
											{item.description || item.complaint_text || "No description"}
										</div>
										{item.evidence_url && (
											<img
												src={item.evidence_url}
												alt="Evidence"
												style={{ width: "100%", borderRadius: 4, marginTop: 8, cursor: "pointer" }}
												onClick={() => setLightboxImg(item.evidence_url)}
											/>
										)}
									</div>
								))}
							</div>
						)}

						{/* Status Buttons */}
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

			{/* Individual Complaint Detail Modal */}
			{detailModal && (
				<div className="gov-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDetailModal(null)}>
					<div className="gov-modal" style={{ maxWidth: 500 }}>
						<div className="gov-modal-header">
							<h3 style={{ margin: 0 }}>Detailed Report</h3>
							<button className="gov-modal-close" onClick={() => setDetailModal(null)}>×</button>
						</div>
						
						<div style={{ marginBottom: 20 }}>
							<div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{detailModal.description}</div>
							<div className="gov-pill" style={{ background: "rgba(255,255,255,0.05)", marginRight: 8 }}>{detailModal.id}</div>
							<span className={`gov-tag ${detailModal.source}`}>{detailModal.source}</span>
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 25 }}>
							<div>
								<div className="gov-muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Location</div>
								<div style={{ fontWeight: 700 }}>{detailModal.area ? `${detailModal.area}, ` : ""}{detailModal.city}</div>
							</div>
							<div>
								<div className="gov-muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Date Reported</div>
								<div style={{ fontWeight: 700 }}>{detailModal.date}</div>
							</div>
						</div>

						{detailModal.evidence_url && (
							<div style={{ marginBottom: 20 }}>
								<div className="gov-muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Evidence Attachment</div>
								<img 
									src={`http://localhost:8001${detailModal.evidence_url}`} 
									alt="Evidence" 
									style={{ width: "100%", borderRadius: 12, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}
									onClick={() => setLightboxImg(`http://localhost:8001${detailModal.evidence_url}`)}
								/>
							</div>
						)}

						<div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
							<button 
								className="gov-btn gov-btn-save" 
								style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}
								onClick={() => resolveIndividual(detailModal.id)}
							>
								Confirm Resolution
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Lightbox */}
			{lightboxImg && (
				<div className="gov-lightbox" onClick={() => setLightboxImg(null)}>
					<img src={lightboxImg} alt="Enlarged" />
				</div>
			)}
		</>
	);
};

export default GovDashboard;
