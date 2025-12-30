
// Pacific Cargo App Routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserDashboard, UserShipments, CreateShipment, SavedAddresses, Transactions, FundWallet } from './pages/dashboard';
import Login from './pages/auth/Login';
import TrackPage from './pages/Track';
import Register from './pages/auth/Register';
import EmailConfirmation from './pages/auth/EmailConfirmation';
import { SuperAdminDashboard, AdminSettings, AdminShipments, AdminCreateShipment, AdminNotifications, Analytics, AdminUsers } from './pages/admin';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track" element={<TrackPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/confirm-email" element={<EmailConfirmation />} />

                {/* User Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/dashboard/shipments" element={<UserShipments />} />
                <Route path="/dashboard/create-shipment" element={<CreateShipment />} />
                <Route path="/dashboard/addresses" element={<SavedAddresses />} />
                <Route path="/dashboard/transactions" element={<Transactions />} />
                <Route path="/dashboard/wallet" element={<FundWallet />} />

                {/* Super Admin Routes */}
                <Route path="/admin" element={<Navigate to="/admin/login" />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/create-shipment" element={<AdminCreateShipment />} />
                <Route path="/admin/shipments" element={<AdminShipments />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
        </Router>
    )
}

export default App;
