import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardLayout } from './components/dashboards/DashboardLayout';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';

import { AdminOverview } from './pages/dashboards/AdminOverview';
import { AdminRequests } from './pages/dashboards/AdminRequests';
import { AdminBookings } from './pages/dashboards/AdminBookings';
import { AdminReviews } from './pages/dashboards/AdminReviews';
import { AdminDonations } from './pages/dashboards/AdminDonations';

import { CEODashboard } from './pages/dashboards/CEODashboard';
import { UserDashboard } from './pages/dashboards/UserDashboard';

// Placeholder sub-pages for CEO and User
const CEOMessages = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Priority Messages</h1>
    <p className="text-gray-400">Secure CEO Communication Bridge (Encrypted)</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-50 rounded w-full mb-2" />
          <div className="h-4 bg-gray-50 rounded w-full" />
        </div>
      ))}
    </div>
  </div>
);

const UserRequests = () => <AdminRequests />; // Reusing the UI for now, logic can be filtered later
const UserBookings = () => <AdminBookings />;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="talk-to-ceo" element={<CEOMessages />} />
          <Route path="donate" element={<div className="pt-32 text-center">Donation Gateway (Coming Soon)</div>} />
        </Route>

        {/* Dashboard Routes System */}

        {/* Admin Tier */}
        <Route path="dashboard/admin" element={<DashboardLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="donations" element={<AdminDonations />} />
        </Route>

        {/* CEO Tier */}
        <Route path="dashboard/ceo" element={<DashboardLayout />}>
          <Route index element={<CEODashboard />} />
          <Route path="messages" element={<CEOMessages />} />
          <Route path="meetings" element={<AdminBookings />} />
        </Route>

        {/* User Tier */}
        <Route path="dashboard/user" element={<DashboardLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="requests" element={<UserRequests />} />
          <Route path="bookings" element={<UserBookings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
