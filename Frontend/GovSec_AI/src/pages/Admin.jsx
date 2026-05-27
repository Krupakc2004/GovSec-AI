import React, { useState, useEffect } from "react";
import {
	CheckCircle,
	Clock,
	XCircle,
	AlertTriangle,
	MapPin,
	Filter,
	FileText,
	Edit3,
	Save,
	TrendingUp,
	Users,
	BarChart3,
	Download,
	Search,
	RefreshCw,
	Plus,
	Trash2,
} from "lucide-react";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("complaints");
	const [selectedComplaint, setSelectedComplaint] = useState(null);
	const [complaints, setComplaints] = useState([]);
	const [filters, setFilters] = useState({
		status: "All",
		district: "All",
		category: "All",
	});
	const [policyText, setPolicyText] = useState("");
	const [showPolicyEditor, setShowPolicyEditor] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [policies, setPolicies] = useState([]);
	const [showAddPolicy, setShowAddPolicy] = useState(false);
	const [newPolicy, setNewPolicy] = useState({
		title: "",
		department: "",
		content: "",
	});
	const [editingPolicyId, setEditingPolicyId] = useState(null);
	const [formErrors, setFormErrors] = useState({});

	// Fetch complaints from API
	const fetchComplaints = async () => {
		setLoading(true);
		try {
			// Replace with: const response = await fetch('YOUR_API_ENDPOINT/complaints')
			setTimeout(() => {
				setComplaints([
					{
						id: 1,
						category: "Corruption",
						district: "Ahmedabad",
						area: "Satellite",
						status: "Pending",
						priority: "High",
						date: "2025-10-28",
						description:
							"Bribery demanded for trade license approval at Ahmedabad Municipal Corporation",
						assignedTo: "Officer A - AMC",
						updates: ["Complaint registered", "Investigation initiated"],
					},
					{
						id: 2,
						category: "Service Delay",
						district: "Ahmedabad",
						area: "Maninagar",
						status: "In Progress",
						priority: "Medium",
						date: "2025-10-29",
						description:
							"Ration card application pending for 5 months at Taluka office",
						assignedTo: "Officer B - Food & Civil Supply",
						updates: [
							"Complaint registered",
							"Documents verified",
							"Processing",
						],
					},
					{
						id: 3,
						category: "Infrastructure",
						district: "Surat",
						area: "Adajan",
						status: "Resolved",
						priority: "Low",
						date: "2025-10-30",
						description: "Damaged road causing accidents near Adajan circle",
						assignedTo: "Officer C - Surat Municipal Corporation",
						updates: [
							"Complaint registered",
							"Survey completed",
							"Repair work done",
							"Resolved",
						],
					},
					{
						id: 4,
						category: "Corruption",
						district: "Ahmedabad",
						area: "Vastrapur",
						status: "Pending",
						priority: "High",
						date: "2025-11-01",
						description:
							"Illegal fee collection at RTO office for driving license",
						assignedTo: "Officer A - Transport Department",
						updates: ["Complaint registered"],
					},
					{
						id: 5,
						category: "Service Delay",
						district: "Gandhinagar",
						area: "Sector 21",
						status: "Pending",
						priority: "Medium",
						date: "2025-11-01",
						description:
							"Property tax refund not processed at Gandhinagar Municipal Corporation",
						assignedTo: "Officer D - GMC Revenue",
						updates: ["Complaint registered"],
					},
					{
						id: 6,
						category: "Infrastructure",
						district: "Rajkot",
						area: "University Road",
						status: "In Progress",
						priority: "High",
						date: "2025-10-27",
						description:
							"Street light not working in residential area causing safety concerns",
						assignedTo: "Officer E - RMC Electrical",
						updates: ["Complaint registered", "Site inspection done"],
					},
					{
						id: 7,
						category: "Service Delay",
						district: "Vadodara",
						area: "Alkapuri",
						status: "Pending",
						priority: "Medium",
						date: "2025-11-02",
						description:
							"Birth certificate application delayed beyond 15 days SLA",
						assignedTo: "Officer F - VMC Birth & Death",
						updates: ["Complaint registered"],
					},
					{
						id: 8,
						category: "Corruption",
						district: "Surat",
						area: "Varachha",
						status: "In Progress",
						priority: "Critical",
						date: "2025-10-26",
						description:
							"Unauthorized collection by staff at property registration office",
						assignedTo: "Officer G - Sub-Registrar Office",
						updates: [
							"Complaint registered",
							"Inquiry panel formed",
							"Investigation ongoing",
						],
					},
				]);
				setLoading(false);
			}, 500);
		} catch (error) {
			console.error("Error fetching complaints:", error);
			setLoading(false);
		}
	};

	// Fetch policies from API
	const fetchPolicies = async () => {
		try {
			// Replace with: const response = await fetch('YOUR_API_ENDPOINT/policies')
			setPolicies([
				{
					id: 1,
					title: "Corruption Handling Protocol",
					department: "Anti-Corruption Bureau",
					lastUpdated: "Oct 2025",
					content: `CORRUPTION HANDLING PROTOCOL

Department: Anti-Corruption Bureau
Last Updated: October 2025

--- Policy Guidelines ---

1. ACKNOWLEDGMENT TIMELINE
   - All corruption complaints acknowledged within 12 hours
   - Immediate escalation for critical cases
   - Auto-confirmation with reference number sent to complainant

2. INVESTIGATION PROCESS
   - Initial assessment: 24 hours
   - Detailed investigation: 10 working days
   - High priority cases: 5 days expedited review
   - Evidence collection with video documentation

3. RESOLUTION TIMELINE
   - Corruption cases: 45 days with weekly updates
   - Departmental inquiry within 60 days
   - Action against guilty officers: 90 days maximum

4. ESCALATION MATRIX
   - Level 1: District ACB Officer (Days 1-10)
   - Level 2: Regional ACB Head (Days 11-30)
   - Level 3: State ACB Director (Day 31+)

5. TRANSPARENCY REQUIREMENTS
   - Weekly status updates to complainant
   - Protected identity of whistleblowers
   - Public dashboard with anonymized statistics

6. ACCOUNTABILITY
   - Officer assigned within 12 hours
   - Strict monitoring by ACB headquarters
   - Performance linked to case closure rate`,
				},
				{
					id: 2,
					title: "Service Delivery SLA",
					department: "All Municipal Corporations",
					lastUpdated: "Sep 2025",
					content: `SERVICE DELIVERY SLA

Department: All Municipal Corporations
Last Updated: September 2025

--- Policy Guidelines ---

1. ACKNOWLEDGMENT TIMELINE
   - All service complaints acknowledged within 24 hours
   - Auto-SMS/Email confirmation to complainant

2. STANDARD TIMELINES
   - Birth/Death certificates: 7 days
   - Property tax matters: 15 days
   - Trade licenses: 21 days
   - Building permissions: 30 days

3. ESCALATION PROCESS
   - Level 1: Ward Officer (Days 1-15)
   - Level 2: Zone Officer (Days 16-30)
   - Level 3: Municipal Commissioner (Day 31+)

4. PERFORMANCE METRICS
   - 90% cases resolved within SLA
   - Monthly performance review
   - Public dashboard with real-time status`,
				},
				{
					id: 3,
					title: "Infrastructure Complaint Resolution",
					department: "Public Works Department",
					lastUpdated: "Oct 2025",
					content: `INFRASTRUCTURE COMPLAINT RESOLUTION

Department: Public Works Department
Last Updated: October 2025

--- Policy Guidelines ---

1. COMPLAINT CATEGORIES
   - Road damage: Priority based on severity
   - Street lights: 48 hour resolution
   - Drainage issues: 7 days maximum
   - Building structure: Immediate inspection

2. RESPONSE TIMELINE
   - Emergency cases: 24 hours
   - High priority: 7 days
   - Medium priority: 15 days
   - Low priority: 30 days

3. QUALITY ASSURANCE
   - Post-completion inspection
   - 6-month warranty on repairs
   - Citizen feedback mandatory`,
				},
			]);
		} catch (error) {
			console.error("Error fetching policies:", error);
		}
	};

	useEffect(() => {
		fetchComplaints();
		fetchPolicies();
	}, []);

	// Validate policy form
	const validatePolicyForm = () => {
		const errors = {};

		if (!newPolicy.title.trim()) {
			errors.title = "Policy title is required";
		} else if (newPolicy.title.trim().length < 5) {
			errors.title = "Title must be at least 5 characters";
		}

		if (!newPolicy.department.trim()) {
			errors.department = "Department name is required";
		}

		if (!newPolicy.content.trim()) {
			errors.content = "Policy content is required";
		} else if (newPolicy.content.trim().length < 50) {
			errors.content = "Content must be at least 50 characters";
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Add new policy
	const handleAddPolicy = async () => {
		if (!validatePolicyForm()) {
			return;
		}

		try {
			// Replace with: await fetch('YOUR_API_ENDPOINT/policies', { method: 'POST', body: JSON.stringify(newPolicy) })
			const today = new Date();
			const monthNames = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const formattedDate = `${
				monthNames[today.getMonth()]
			} ${today.getFullYear()}`;

			const policyToAdd = {
				id: policies.length + 1,
				title: newPolicy.title,
				department: newPolicy.department,
				lastUpdated: formattedDate,
				content: newPolicy.content,
			};

			setPolicies([...policies, policyToAdd]);
			setNewPolicy({ title: "", department: "", content: "" });
			setShowAddPolicy(false);
			setFormErrors({});
			alert("Policy added successfully!");
		} catch (error) {
			console.error("Error adding policy:", error);
			alert("Failed to add policy");
		}
	};

	// Update existing policy
	const handleUpdatePolicy = async () => {
		if (!policyText.trim() || policyText.trim().length < 50) {
			alert("Policy content must be at least 50 characters");
			return;
		}

		try {
			// Replace with: await fetch(`YOUR_API_ENDPOINT/policies/${editingPolicyId}`, { method: 'PUT', body: JSON.stringify({ content: policyText }) })
			const today = new Date();
			const monthNames = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			const formattedDate = `${
				monthNames[today.getMonth()]
			} ${today.getFullYear()}`;

			setPolicies(
				policies.map((p) =>
					p.id === editingPolicyId
						? { ...p, content: policyText, lastUpdated: formattedDate }
						: p
				)
			);
			setShowPolicyEditor(false);
			setEditingPolicyId(null);
			setPolicyText("");
			alert("Policy updated successfully!");
		} catch (error) {
			console.error("Error updating policy:", error);
			alert("Failed to update policy");
		}
	};

	// Delete policy
	const handleDeletePolicy = async (policyId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this policy? This action cannot be undone."
			)
		) {
			return;
		}

		try {
			// Replace with: await fetch(`YOUR_API_ENDPOINT/policies/${policyId}`, { method: 'DELETE' })
			setPolicies(policies.filter((p) => p.id !== policyId));
			alert("Policy deleted successfully!");
		} catch (error) {
			console.error("Error deleting policy:", error);
			alert("Failed to delete policy");
		}
	};

	// Filter and search complaints dynamically
	const getFilteredComplaints = () => {
		return complaints.filter((c) => {
			const matchesStatus =
				filters.status === "All" || c.status === filters.status;
			const matchesDistrict =
				filters.district === "All" || c.district === filters.district;
			const matchesCategory =
				filters.category === "All" || c.category === filters.category;
			const matchesSearch =
				searchTerm === "" ||
				c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				c.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
				c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
				c.id.toString().includes(searchTerm);

			return (
				matchesStatus && matchesDistrict && matchesCategory && matchesSearch
			);
		});
	};

	// Generate area-wise summary dynamically
	const generateSummary = () => {
		const filtered = getFilteredComplaints();

		const areaGroups = filtered.reduce((acc, complaint) => {
			const key = `${complaint.district}-${complaint.area}`;
			if (!acc[key]) {
				acc[key] = {
					district: complaint.district,
					area: complaint.area,
					complaints: [],
					pending: 0,
					inProgress: 0,
					resolved: 0,
					total: 0,
				};
			}
			acc[key].complaints.push(complaint);
			acc[key].total++;
			if (complaint.status === "Pending") acc[key].pending++;
			if (complaint.status === "In Progress") acc[key].inProgress++;
			if (complaint.status === "Resolved") acc[key].resolved++;
			return acc;
		}, {});

		return Object.values(areaGroups);
	};

	// Update complaint status dynamically
	const updateComplaintStatus = async (complaintId, newStatus, comment) => {
		try {
			// Replace with actual API call
			setComplaints((prev) =>
				prev.map((c) => {
					if (c.id === complaintId) {
						return {
							...c,
							status: newStatus,
							updates: [
								...c.updates,
								`Status updated to ${newStatus}${
									comment ? ": " + comment : ""
								}`,
							],
						};
					}
					return c;
				})
			);
			setSelectedComplaint(null);
		} catch (error) {
			console.error("Error updating complaint:", error);
		}
	};

	const renderComplaintManagement = () => {
		const filteredComplaints = getFilteredComplaints();

		return (
			<div className="space-y-6">
				{/* Filters and Search */}
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
						<div className="flex items-center gap-2">
							<Filter className="w-5 h-5 text-gray-600" />
							<h3 className="text-lg font-bold text-gray-900">
								Filter Complaints
							</h3>
						</div>
						<button
							onClick={fetchComplaints}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
						>
							<RefreshCw className="w-4 h-4" />
							Refresh
						</button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Search complaints..."
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
							/>
						</div>

						<select
							value={filters.category}
							onChange={(e) =>
								setFilters({ ...filters, category: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						>
							<option>All</option>
							<option>Corruption</option>
							<option>Service Delay</option>
							<option>Infrastructure</option>
							<option>Policy Gap</option>
						</select>

						<select
							value={filters.district}
							onChange={(e) =>
								setFilters({ ...filters, district: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						>
							<option>All</option>
							<option>Ahmedabad</option>
							<option>Surat</option>
							<option>Vadodara</option>
							<option>Rajkot</option>
							<option>Gandhinagar</option>
							<option>Bhavnagar</option>
							<option>Jamnagar</option>
						</select>

						<select
							value={filters.status}
							onChange={(e) =>
								setFilters({ ...filters, status: e.target.value })
							}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						>
							<option>All</option>
							<option>Pending</option>
							<option>In Progress</option>
							<option>Resolved</option>
							<option>Rejected</option>
						</select>
					</div>

					<div className="mt-4 text-sm text-gray-600">
						Showing{" "}
						<span className="font-semibold">{filteredComplaints.length}</span>{" "}
						of <span className="font-semibold">{complaints.length}</span>{" "}
						complaints
					</div>
				</div>

				{/* Complaints Table */}
				<div className="bg-white rounded-xl shadow-md border border-gray-100">
					{loading ? (
						<div className="flex items-center justify-center h-64">
							<RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
						</div>
					) : filteredComplaints.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-gray-500">
							<FileText className="w-16 h-16 mb-4 text-gray-300" />
							<p className="text-lg font-semibold">No complaints found</p>
							<p className="text-sm">Try adjusting your filters</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full min-w-max">
								<thead className="bg-gray-50 border-b border-gray-200">
									<tr>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											ID
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Category
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Location
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Date
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Priority
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Status
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Assigned To
										</th>
										<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{filteredComplaints.map((complaint) => (
										<tr
											key={complaint.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
												#{complaint.id}
											</td>
											<td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
												{complaint.category}
											</td>
											<td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
												<div className="flex items-center gap-1">
													<MapPin className="w-4 h-4 flex-shrink-0" />
													<span>
														{complaint.area}, {complaint.district}
													</span>
												</div>
											</td>
											<td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
												{complaint.date}
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
														complaint.priority === "Critical"
															? "bg-red-600 text-white"
															: complaint.priority === "High"
															? "bg-red-100 text-red-700"
															: complaint.priority === "Medium"
															? "bg-yellow-100 text-yellow-700"
															: "bg-green-100 text-green-700"
													}`}
												>
													{complaint.priority}
												</span>
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<span
													className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
														complaint.status === "Resolved"
															? "bg-green-100 text-green-700"
															: complaint.status === "In Progress"
															? "bg-blue-100 text-blue-700"
															: complaint.status === "Rejected"
															? "bg-red-100 text-red-700"
															: "bg-yellow-100 text-yellow-700"
													}`}
												>
													{complaint.status}
												</span>
											</td>
											<td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
												{complaint.assignedTo}
											</td>
											<td className="px-4 py-4 whitespace-nowrap">
												<button
													onClick={() => setSelectedComplaint(complaint)}
													className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
												>
													Manage →
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>

				{/* Complaint Detail Modal */}
				{selectedComplaint && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
							<div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-xl font-bold text-gray-900">
											Complaint #{selectedComplaint.id}
										</h3>
										<p className="text-sm text-gray-600 mt-1">
											{selectedComplaint.category} • {selectedComplaint.area},{" "}
											{selectedComplaint.district}
										</p>
									</div>
									<button
										onClick={() => setSelectedComplaint(null)}
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										<XCircle className="w-6 h-6" />
									</button>
								</div>
							</div>

							<div className="p-6 space-y-6">
								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Description
									</h4>
									<p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
										{selectedComplaint.description}
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Assigned Officer
									</h4>
									<p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
										{selectedComplaint.assignedTo}
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-gray-900 mb-3">
										Progress Timeline
									</h4>
									<div className="space-y-3">
										{selectedComplaint.updates.map((update, index) => (
											<div key={index} className="flex gap-3">
												<div className="flex flex-col items-center flex-shrink-0">
													<div className="w-3 h-3 bg-blue-600 rounded-full"></div>
													{index < selectedComplaint.updates.length - 1 && (
														<div className="w-0.5 flex-grow bg-blue-200 mt-1 min-h-[20px]"></div>
													)}
												</div>
												<div className="pb-4 flex-1">
													<p className="text-sm text-gray-700">{update}</p>
												</div>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-gray-900 mb-3">
										Update Status
									</h4>
									<div className="grid grid-cols-2 gap-3">
										<button
											onClick={() =>
												updateComplaintStatus(
													selectedComplaint.id,
													"In Progress",
													"Investigation started"
												)
											}
											className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold flex items-center justify-center gap-2 transition-colors"
										>
											<Clock className="w-4 h-4" />
											In Progress
										</button>
										<button
											onClick={() =>
												updateComplaintStatus(
													selectedComplaint.id,
													"Resolved",
													"Issue resolved"
												)
											}
											className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold flex items-center justify-center gap-2 transition-colors"
										>
											<CheckCircle className="w-4 h-4" />
											Resolve
										</button>
										<button
											onClick={() =>
												updateComplaintStatus(
													selectedComplaint.id,
													"Pending",
													"Need more information"
												)
											}
											className="px-4 py-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-semibold flex items-center justify-center gap-2 transition-colors"
										>
											<AlertTriangle className="w-4 h-4" />
											Pending
										</button>
										<button
											onClick={() =>
												updateComplaintStatus(
													selectedComplaint.id,
													"Rejected",
													"Invalid complaint"
												)
											}
											className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold flex items-center justify-center gap-2 transition-colors"
										>
											<XCircle className="w-4 h-4" />
											Reject
										</button>
									</div>
								</div>

								<div>
									<h4 className="font-semibold text-gray-900 mb-2">
										Add Comment
									</h4>
									<textarea
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
										rows="3"
										placeholder="Add investigation notes or updates..."
									></textarea>
									<button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
										Save Comment
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderAreaSummary = () => {
		const summaryData = generateSummary();
		const totalComplaints = summaryData.reduce(
			(acc, area) => acc + area.total,
			0
		);
		const totalResolved = summaryData.reduce(
			(acc, area) => acc + area.resolved,
			0
		);
		const resolutionRate =
			totalComplaints > 0
				? Math.round((totalResolved / totalComplaints) * 100)
				: 0;

		return (
			<div className="space-y-6">
				<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						<div>
							<h3 className="text-xl font-bold text-gray-900">
								Area-wise Complaint Summary - Gujarat
							</h3>
							<p className="text-sm text-gray-600 mt-1">
								{filters.category !== "All"
									? `Category: ${filters.category}`
									: "All Categories"}{" "}
								•
								{filters.district !== "All"
									? ` ${filters.district} District`
									: " All Districts"}
							</p>
						</div>
						<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors whitespace-nowrap">
							<Download className="w-4 h-4" />
							Export Report
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm font-medium">
									Total Complaints
								</p>
								<h3 className="text-3xl font-bold text-gray-900 mt-2">
									{totalComplaints}
								</h3>
							</div>
							<FileText className="w-10 h-10 text-blue-500" />
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm font-medium">
									Areas Affected
								</p>
								<h3 className="text-3xl font-bold text-gray-900 mt-2">
									{summaryData.length}
								</h3>
							</div>
							<MapPin className="w-10 h-10 text-red-500" />
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-600 text-sm font-medium">
									Resolution Rate
								</p>
								<h3 className="text-3xl font-bold text-gray-900 mt-2">
									{resolutionRate}%
								</h3>
							</div>
							<TrendingUp className="w-10 h-10 text-green-500" />
						</div>
					</div>
				</div>

				{summaryData.length > 0 ? (
					<>
						<div className="bg-white rounded-xl shadow-md border border-gray-100">
							<div className="p-6 border-b border-gray-200">
								<h3 className="text-lg font-bold text-gray-900">
									Breakdown by Area
								</h3>
							</div>
							<div className="overflow-x-auto">
								<table className="w-full min-w-max">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												District
											</th>
											<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												Area
											</th>
											<th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												Total
											</th>
											<th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												Pending
											</th>
											<th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												In Progress
											</th>
											<th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
												Resolved
											</th>
											<th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
												Progress
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{summaryData.map((area, index) => (
											<tr
												key={index}
												className="hover:bg-gray-50 transition-colors"
											>
												<td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
													{area.district}
												</td>
												<td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
													{area.area}
												</td>
												<td className="px-4 py-4 text-sm font-semibold text-gray-900 text-center whitespace-nowrap">
													{area.total}
												</td>
												<td className="px-4 py-4 text-sm text-yellow-700 font-semibold text-center whitespace-nowrap">
													{area.pending}
												</td>
												<td className="px-4 py-4 text-sm text-blue-700 font-semibold text-center whitespace-nowrap">
													{area.inProgress}
												</td>
												<td className="px-4 py-4 text-sm text-green-700 font-semibold text-center whitespace-nowrap">
													{area.resolved}
												</td>
												<td className="px-4 py-4 whitespace-nowrap">
													<div className="flex items-center gap-2">
														<div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[80px]">
															<div
																className="bg-green-600 h-2 rounded-full transition-all"
																style={{
																	width: `${
																		(area.resolved / area.total) * 100
																	}%`,
																}}
															></div>
														</div>
														<span className="text-xs text-gray-600 font-semibold min-w-[35px] text-right">
															{Math.round((area.resolved / area.total) * 100)}%
														</span>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md p-6 border border-purple-200">
							<div className="flex items-start gap-3">
								<BarChart3 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
								<div className="flex-1">
									<h4 className="font-bold text-gray-900 mb-3">
										AI-Generated Insights (NLP Analysis)
									</h4>
									<div className="space-y-2 text-sm text-gray-700">
										{summaryData.filter((a) => a.pending > 0).length > 0 && (
											<p>
												• <strong>High Priority Areas:</strong>{" "}
												{summaryData
													.filter((a) => a.pending > 0)
													.map((a) => `${a.area} (${a.pending} pending)`)
													.join(", ")}
											</p>
										)}
										<p>
											• <strong>Overall Performance:</strong> {resolutionRate}%
											complaints resolved across {summaryData.length} areas
										</p>
										{summaryData.filter((a) => a.resolved / a.total === 1)
											.length > 0 && (
											<p>
												• <strong>100% Resolution:</strong>{" "}
												{summaryData
													.filter((a) => a.resolved / a.total === 1)
													.map((a) => `${a.area}, ${a.district}`)
													.join(" | ")}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
						<BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<p className="text-lg font-semibold text-gray-900">
							No data available
						</p>
						<p className="text-sm text-gray-600 mt-2">
							Adjust filters to view area summary
						</p>
					</div>
				)}
			</div>
		);
	};

	const renderPolicyManagement = () => (
		<div className="space-y-6">
			{/* Header with Add Button */}
			<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-xl font-bold text-gray-900">
							Policy Management - Gujarat State
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							Manage government policies and guidelines
						</p>
					</div>
					<button
						onClick={() => {
							setShowAddPolicy(true);
							setNewPolicy({ title: "", department: "", content: "" });
							setFormErrors({});
						}}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors whitespace-nowrap"
					>
						<Plus className="w-4 h-4" />
						Add New Policy
					</button>
				</div>
			</div>

			{/* Policy List */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{policies.map((policy) => (
					<div
						key={policy.id}
						className="bg-white p-5 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h4 className="font-semibold text-gray-900 mb-1">
									{policy.title}
								</h4>
								<p className="text-xs text-gray-500 mb-1">
									{policy.department}
								</p>
								<p className="text-xs text-gray-600">
									Last updated: {policy.lastUpdated}
								</p>
							</div>
							<div className="flex gap-2 flex-shrink-0">
								<button
									onClick={() => {
										setShowPolicyEditor(true);
										setEditingPolicyId(policy.id);
										setPolicyText(policy.content);
									}}
									className="text-blue-600 hover:text-blue-700 transition-colors"
									title="Edit Policy"
								>
									<Edit3 className="w-5 h-5" />
								</button>
								<button
									onClick={() => handleDeletePolicy(policy.id)}
									className="text-red-600 hover:text-red-700 transition-colors"
									title="Delete Policy"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Add Policy Modal */}
			{showAddPolicy && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-xl font-bold text-gray-900">
										Add New Policy
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										Create a new government policy document
									</p>
								</div>
								<button
									onClick={() => {
										setShowAddPolicy(false);
										setNewPolicy({ title: "", department: "", content: "" });
										setFormErrors({});
									}}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<XCircle className="w-6 h-6" />
								</button>
							</div>
						</div>

						<div className="p-6 space-y-6">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Policy Title <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									value={newPolicy.title}
									onChange={(e) => {
										setNewPolicy({ ...newPolicy, title: e.target.value });
										if (formErrors.title)
											setFormErrors({ ...formErrors, title: "" });
									}}
									placeholder="e.g., Digital Services SLA Policy"
									className={`w-full px-4 py-3 border ${
										formErrors.title ? "border-red-500" : "border-gray-300"
									} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
								/>
								{formErrors.title && (
									<p className="text-red-600 text-sm mt-1">
										{formErrors.title}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Department <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									value={newPolicy.department}
									onChange={(e) => {
										setNewPolicy({ ...newPolicy, department: e.target.value });
										if (formErrors.department)
											setFormErrors({ ...formErrors, department: "" });
									}}
									placeholder="e.g., Urban Development Department"
									className={`w-full px-4 py-3 border ${
										formErrors.department ? "border-red-500" : "border-gray-300"
									} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
								/>
								{formErrors.department && (
									<p className="text-red-600 text-sm mt-1">
										{formErrors.department}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Policy Content <span className="text-red-600">*</span>
								</label>
								<textarea
									value={newPolicy.content}
									onChange={(e) => {
										setNewPolicy({ ...newPolicy, content: e.target.value });
										if (formErrors.content)
											setFormErrors({ ...formErrors, content: "" });
									}}
									placeholder="Enter detailed policy guidelines, rules, and procedures..."
									className={`w-full px-4 py-3 border ${
										formErrors.content ? "border-red-500" : "border-gray-300"
									} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none font-mono text-sm`}
									rows="14"
								></textarea>
								{formErrors.content && (
									<p className="text-red-600 text-sm mt-1">
										{formErrors.content}
									</p>
								)}
								<p className="text-xs text-gray-500 mt-1">
									{newPolicy.content.length} characters (minimum 50 required)
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleAddPolicy}
									className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
								>
									<Plus className="w-4 h-4" />
									Create Policy
								</button>
								<button
									onClick={() => {
										setShowAddPolicy(false);
										setNewPolicy({ title: "", department: "", content: "" });
										setFormErrors({});
									}}
									className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Edit Policy Modal */}
			{showPolicyEditor && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-xl font-bold text-gray-900">
										Edit Policy Document
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{policies.find((p) => p.id === editingPolicyId)?.title}
									</p>
								</div>
								<button
									onClick={() => {
										setShowPolicyEditor(false);
										setEditingPolicyId(null);
										setPolicyText("");
									}}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<XCircle className="w-6 h-6" />
								</button>
							</div>
						</div>

						<div className="p-6 space-y-6">
							<div>
								<label className="block text-sm font-semibold text-gray-900 mb-2">
									Policy Content
								</label>
								<textarea
									value={policyText}
									onChange={(e) => setPolicyText(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm resize-none"
									rows="16"
								></textarea>
								<p className="text-xs text-gray-500 mt-1">
									{policyText.length} characters
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleUpdatePolicy}
									className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
								>
									<Save className="w-4 h-4" />
									Save & Publish Policy
								</button>
								<button
									onClick={() => {
										setShowPolicyEditor(false);
										setEditingPolicyId(null);
										setPolicyText("");
									}}
									className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Header */}
			<header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
				<div className="px-4 sm:px-6 py-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								GovSecAI Admin Portal
							</h1>
							<p className="text-xs text-gray-600 mt-1">
								Government of Gujarat • e-Governance Division
							</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="text-right">
								<p className="text-sm font-semibold text-gray-900">
									Admin Officer
								</p>
								<p className="text-xs text-gray-600">Gujarat State</p>
							</div>

							<button
								onClick={() => navigate("/adminprofile")}
								className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-105 transition-all"
								title="View Profile"
							>
								G
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="flex flex-col lg:flex-row">
				{/* Sidebar */}
				<aside className="lg:w-64 bg-white border-b lg:border-r lg:border-b-0 border-gray-200 lg:min-h-[calc(100vh-89px)] lg:sticky lg:top-[89px]">
					<nav className="p-4">
						<div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
							{[
								{ id: "complaints", label: "Manage Complaints", icon: Users },
								{ id: "summary", label: "Area Summary", icon: BarChart3 },
								{ id: "policy", label: "Update Policies", icon: FileText },
							].map((item) => (
								<button
									key={item.id}
									onClick={() => setActiveTab(item.id)}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
										activeTab === item.id
											? "bg-blue-600 text-white shadow-md"
											: "text-gray-700 hover:bg-gray-100"
									}`}
								>
									<item.icon className="w-5 h-5 flex-shrink-0" />
									<span className="font-medium">{item.label}</span>
								</button>
							))}
						</div>
					</nav>
				</aside>

				{/* Main Content */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8">
					{activeTab === "complaints" && renderComplaintManagement()}
					{activeTab === "summary" && renderAreaSummary()}
					{activeTab === "policy" && renderPolicyManagement()}
				</main>
			</div>
		</div>
	);
};

export default Admin;
