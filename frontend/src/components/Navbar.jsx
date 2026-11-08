import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTools, 
  FaPlusCircle, 
  FaUser, 
  FaSignOutAlt, 
  FaShoppingBag, 
  FaThList, 
  FaKey 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, switchDummyUser } = useAuth();

  const demoAccounts = [
    {
      id: 1,
      username: 'rahul_sharma',
      first_name: 'Rahul',
      last_name: 'Sharma',
      email: 'rahul@example.com',
      profile: {
        city: 'South Delhi',
        phone: '+91 98765 43210',
        bio: 'Home DIY enthusiast & friendly neighborhood tool lender!',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    },
    {
      id: 2,
      username: 'priya_patel',
      first_name: 'Priya',
      last_name: 'Patel',
      email: 'priya@example.com',
      profile: {
        city: 'Gurugram',
        phone: '+91 98111 22334',
        bio: 'Gardener and weekend renovator.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    },
    {
      id: 3,
      username: 'amit_verma',
      first_name: 'Amit',
      last_name: 'Verma',
      email: 'amit@example.com',
      profile: {
        city: 'Noida',
        phone: '+91 99223 88441',
        bio: 'Mechanical engineer with a well-stocked home garage.',
        avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    }
  ];

  const handleDemoSwitch = (e) => {
    const selected = demoAccounts.find(acc => acc.username === e.target.value);
    if (selected) {
      switchDummyUser(selected);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-badge">
            <FaTools size={18} />
          </div>
          <span>Share<span style={{ color: 'var(--primary)' }}>N</span>Tool</span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/browse" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              Browse Tools
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/my-rentals" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <FaShoppingBag size={14} /> My Rentals
                </NavLink>
              </li>
              <li>
                <NavLink to="/owner-bookings" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <FaThList size={14} /> Tool Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-tools" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  My Listed Tools
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Right Actions & Demo Switcher */}
        <div className="navbar-actions">
          {/* Quick Demo Persona Switcher for College Presentation */}
          <div className="demo-switcher" title="College Project Demo: Switch Test User Instantly">
            <FaKey size={13} color="#D48C00" />
            <select value={user?.username || ''} onChange={handleDemoSwitch}>
              {demoAccounts.map(acc => (
                <option key={acc.id} value={acc.username}>
                  Demo: {acc.first_name} ({acc.profile.city})
                </option>
              ))}
            </select>
          </div>

          <Link to="/add-tool" className="btn btn-primary btn-sm">
            <FaPlusCircle size={14} /> Post Tool
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem' }}>
                <img
                  src={user.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt="avatar"
                  style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 600 }}>{user.first_name || user.username}</span>
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-sm" title="Logout">
                <FaSignOutAlt size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <FaUser size={14} /> Dummy Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
