import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';

import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { CEODashboard } from './pages/dashboards/CEODashboard';

// Prototype/Placeholder Pages
const UserDashboard = () => <div className="p-10 pt-32">User Dashboard (Under Construction)</div>;
const TalkToCEO = () => <div className="p-10 pt-32">Talk to CEO Interface (Under Construction)</div>;
const Donate = () => <div className="p-10 pt-32">Donate Page (Under Construction)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
          <Route path="talk-to-ceo" element={<TalkToCEO />} />
          <Route path="donate" element={<Donate />} />

          {/* Dashboards */}
          <Route path="dashboard/admin" element={<AdminDashboard />} />
          <Route path="dashboard/ceo" element={<CEODashboard />} />
          <Route path="dashboard/user" element={<UserDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
