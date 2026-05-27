import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	AlertCircle,
	CheckCircle,
	MessageSquare,
	X,
	Bell,
	Trash2,
	CheckCheck,
	Info,
} from "lucide-react";

const Notifications = () => {
	const [alerts, setAlerts] = useState([
		{
			id: 1,
			type: "success",
			title: "Complaint Resolved",
			message:
				"Your complaint C002 regarding water supply has been successfully resolved",
			time: "2 hours ago",
			read: false,
			category: "Complaint",
		},
		{
			id: 2,
			type: "info",
			title: "Policy Update",
			message: "New policy update: Healthcare Reform Act 2025 is now active",
			time: "1 day ago",
			read: false,
			category: "Policy",
		},
		{
			id: 3,
			type: "warning",
			title: "Maintenance Alert",
			message:
				"Scheduled maintenance in your area on Nov 5, 2025. Services may be temporarily unavailable",
			time: "3 days ago",
			read: true,
			category: "System",
		},
		{
			id: 4,
			type: "success",
			title: "Feedback Acknowledged",
			message:
				"Your feedback on Tax Policy has been acknowledged by the department",
			time: "5 days ago",
			read: true,
			category: "Feedback",
		},
		{
			id: 5,
			type: "info",
			title: "Community Event",
			message:
				"Community meeting scheduled for Nov 10, 2025 at 3:00 PM. Your participation is welcome",
			time: "1 week ago",
			read: false,
			category: "Event",
		},
	]);

	const [filter, setFilter] = useState("all");

	// --- Helper Functions ---
	const removeAlert = (id) => setAlerts(alerts.filter((a) => a.id !== id));

	const markAsRead = (id) =>
		setAlerts(alerts.map((a) => (a.id === id ? { ...a, read: true } : a)));

	const markAllAsRead = () =>
		setAlerts(alerts.map((a) => ({ ...a, read: true })));

	const clearAll = () => setAlerts([]);

	const getAlertIcon = (type) => {
		switch (type) {
			case "success":
				return <CheckCircle className="w-6 h-6 text-green-500" />;
			case "warning":
				return <AlertCircle className="w-6 h-6 text-yellow-500" />;
			default:
				return <Info className="w-6 h-6 text-blue-500" />;
		}
	};

	const getAlertStyles = (type, read) => {
		const base = read ? "bg-gray-50" : "bg-white";
		switch (type) {
			case "success":
				return `${base} border-green-500`;
			case "warning":
				return `${base} border-yellow-500`;
			default:
				return `${base} border-blue-500`;
		}
	};

	const filteredAlerts = alerts.filter((a) => {
		if (filter === "all") return true;
		if (filter === "unread") return !a.read;
		return a.type === filter;
	});

	const unreadCount = alerts.filter((a) => !a.read).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center space-x-3">
						<Bell className="w-8 h-8 text-indigo-600" />
						<div>
							<h2 className="text-2xl font-bold text-gray-900">
								Notifications
							</h2>
							<p className="text-sm text-gray-600">
								{unreadCount > 0
									? `${unreadCount} unread notification${
											unreadCount > 1 ? "s" : ""
									  }`
									: "All caught up!"}
							</p>
						</div>
					</div>

					<Link
						to="/citizendashboard"
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						aria-label="Back to dashboard"
						title="Back to dashboard"
					>
						<X className="w-6 h-6" />
					</Link>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-wrap gap-2 mb-4">
					{unreadCount > 0 && (
						<button
							onClick={markAllAsRead}
							className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center space-x-2"
						>
							<CheckCheck className="w-4 h-4" />
							<span>Mark all read</span>
						</button>
					)}
					{alerts.length > 0 && (
						<button
							onClick={clearAll}
							className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
						>
							<Trash2 className="w-4 h-4" />
							<span>Clear all</span>
						</button>
					)}
				</div>

				{/* Filter Buttons */}
				<div className="flex flex-wrap gap-2">
					{[
						{ value: "all", label: "All", count: alerts.length },
						{ value: "unread", label: "Unread", count: unreadCount },
						{
							value: "success",
							label: "Success",
							count: alerts.filter((a) => a.type === "success").length,
						},
						{
							value: "info",
							label: "Info",
							count: alerts.filter((a) => a.type === "info").length,
						},
						{
							value: "warning",
							label: "Warning",
							count: alerts.filter((a) => a.type === "warning").length,
						},
					].map((f) => (
						<button
							key={f.value}
							onClick={() => setFilter(f.value)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filter === f.value
									? "bg-indigo-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							{f.label} ({f.count})
						</button>
					))}
				</div>
			</div>

			{/* Notifications List */}
			<div className="space-y-4">
				{filteredAlerts.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-12 text-center">
						<MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-600 mb-2">
							No Notifications
						</h3>
						<p className="text-gray-500">
							{filter === "all"
								? "You're all caught up! Check back later for updates."
								: `No ${filter} notifications at the moment.`}
						</p>
					</div>
				) : (
					filteredAlerts.map((alert) => (
						<div
							key={alert.id}
							className={`rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-all duration-300 ${getAlertStyles(
								alert.type,
								alert.read
							)}`}
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start space-x-4 flex-1">
									<div className="flex-shrink-0">
										{getAlertIcon(alert.type)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center space-x-2 mb-1">
											<h4
												className={`font-semibold ${
													alert.read ? "text-gray-700" : "text-gray-900"
												}`}
											>
												{alert.title}
											</h4>
											{!alert.read && (
												<span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full"></span>
											)}
										</div>
										<p
											className={`text-sm mb-2 ${
												alert.read ? "text-gray-600" : "text-gray-800"
											}`}
										>
											{alert.message}
										</p>
										<div className="flex items-center space-x-3">
											<span className="text-xs text-gray-500">
												{alert.time}
											</span>
											<span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
												{alert.category}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2 ml-4">
									{!alert.read && (
										<button
											onClick={() => markAsRead(alert.id)}
											className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
											aria-label="Mark as read"
											title="Mark as read"
										>
											<CheckCheck className="w-5 h-5" />
										</button>
									)}
									<button
										onClick={() => removeAlert(alert.id)}
										className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										aria-label="Dismiss alert"
										title="Dismiss"
									>
										<X className="w-5 h-5" />
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Stats Footer */}
			{alerts.length > 0 && (
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
						<div>
							<div className="text-2xl font-bold text-gray-900">
								{alerts.length}
							</div>
							<div className="text-sm text-gray-600">Total Notifications</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-green-600">
								{alerts.filter((a) => a.type === "success").length}
							</div>
							<div className="text-sm text-gray-600">Success</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-blue-600">
								{alerts.filter((a) => a.type === "info").length}
							</div>
							<div className="text-sm text-gray-600">Information</div>
						</div>
						<div>
							<div className="text-2xl font-bold text-yellow-600">
								{alerts.filter((a) => a.type === "warning").length}
							</div>
							<div className="text-sm text-gray-600">Warnings</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Notifications;
