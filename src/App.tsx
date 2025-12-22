
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import CreateShipment from './pages/admin/CreateShipment';
import AdminLogin from './pages/admin/Login';
import TrackPage from './pages/Track';
import PublicLayout from './layouts/PublicLayout';

// Temporary Home Component
const Home = () => (
    <PublicLayout>
        <div className="bg-slate-900 text-white py-20 px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Global Logistics Solution</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">Fast, reliable, and secure cargo shipment to any destination in the world.</p>
            <a href="/track" className="bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-600 transition">Track Your Shipment</a>
        </div>
    </PublicLayout>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<TrackPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<Navigate to="/admin/login" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/create-shipment" element={<CreateShipment />} />
                <Route path="/admin/wallet" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/admin/trackings" element={<Dashboard />} /> {/* Placeholder */}
            </Routes>
        </Router>
    )
}

export default App
