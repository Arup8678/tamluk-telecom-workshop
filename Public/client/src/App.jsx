import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import RepairRequest from './pages/RepairRequest';
import Requisition from './pages/Requisition';
import StatusTracking from './pages/StatusTracking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repair-request" element={<RepairRequest />} />
          <Route path="/requisition" element={<Requisition />} />
          <Route path="/track-status" element={<StatusTracking />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
