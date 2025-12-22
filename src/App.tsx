
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/admin/Dashboard';
import CreateShipment from './pages/admin/CreateShipment';
import AdminLogin from './pages/admin/Login';
import TrackPage from './pages/Track';


import Home from './pages/Home';

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
