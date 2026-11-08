import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseTools from './pages/BrowseTools';
import ToolDetails from './pages/ToolDetails';
import AddTool from './pages/AddTool';
import EditTool from './pages/EditTool';
import MyTools from './pages/MyTools';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import OwnerBookings from './pages/OwnerBookings';
import Payment from './pages/Payment';
import Handover from './pages/Handover';
import ReturnTool from './pages/ReturnTool';
import DamageReport from './pages/DamageReport';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/browse" element={<BrowseTools />} />
          <Route path="/tools/:id" element={<ToolDetails />} />

          {/* Protected Routes (using friendly dummy login) */}
          <Route path="/add-tool" element={<ProtectedRoute><AddTool /></ProtectedRoute>} />
          <Route path="/edit-tool/:id" element={<ProtectedRoute><EditTool /></ProtectedRoute>} />
          <Route path="/my-tools" element={<ProtectedRoute><MyTools /></ProtectedRoute>} />
          <Route path="/booking/:toolId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/my-rentals" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/owner-bookings" element={<ProtectedRoute><OwnerBookings /></ProtectedRoute>} />
          <Route path="/payment/:bookingId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/handover/:bookingId" element={<ProtectedRoute><Handover /></ProtectedRoute>} />
          <Route path="/return-tool/:bookingId" element={<ProtectedRoute><ReturnTool /></ProtectedRoute>} />
          <Route path="/damage-report/:bookingId" element={<ProtectedRoute><DamageReport /></ProtectedRoute>} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

