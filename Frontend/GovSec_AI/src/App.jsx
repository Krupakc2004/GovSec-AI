import { RouterProvider, createBrowserRouter } from "react-router";
import { Route, createRoutesFromElements } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import CitizenDashboard from "./pages/CitizenDashboard";
import Notifications from "./components/Notifications";
import GovDashboard from "./pages/GovDashboard";
import OTP from "./pages/OTP";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/AdminProfile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/register" element={<Register />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route
					path="/citizendashboard"
					element={
						<ProtectedRoute requiredRole="citizen">
							<CitizenDashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/notifications" element={<Notifications />} />
				<Route
					path="/admin"
					element={
						<ProtectedRoute requiredRole="gov">
							<GovDashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/adminprofile" element={<AdminProfile />} />
				<Route path="/otp" element={<OTP />} />
				<Route path="/profile" element={<Profile />} />
			</>
		)
	);

	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer theme="dark" />
		</>
	);
};

export default App;
