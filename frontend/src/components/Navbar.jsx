import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTools, 
  FaPlus, 
  FaUser, 
  FaSignOutAlt, 
  FaShoppingBag, 
  FaClipboardList, 
  FaWrench,
  FaKey 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, switchDummyUser } = useAuth();

  const demoAccounts = [
    {
      id: 1,
      username: 'rahul_kurian',
      first_name: 'Rahul',
      last_name: 'Kurian',
      email: 'rahul.k@example.com',
      profile: {
        city: 'Kochi',
        phone: '+91 98470 12345',
        bio: 'Home DIY enthusiast in Ernakulam & friendly neighborhood tool lender!',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    },
    {
      id: 2,
      username: 'anjali_menon',
      first_name: 'Anjali',
      last_name: 'Menon',
      email: 'anjali.m@example.com',
      profile: {
        city: 'Trivandrum',
        phone: '+91 94471 22334',
        bio: 'Gardener and home renovator in Kazhakkoottam, Trivandrum.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    },
    {
      id: 3,
      username: 'faisal_rahman',
      first_name: 'Faisal',
      last_name: 'Rahman',
      email: 'faisal.r@example.com',
      profile: {
        city: 'Kozhikode',
        phone: '+91 98950 33441',
        bio: 'Workshop owner with professional power tools & sprayers in Calicut.',
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
            <FaTools size={17} />
          </div>
          <span>Share<span style={{ color: 'var(--primary)' }}>N</span>Tool</span>
        </Link>

        {/* Clean, Non-Breaking Navigation Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/browse" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
              Browse
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/my-rentals" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <FaShoppingBag size={13} />
                  <span>My Rentals</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/owner-bookings" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <FaClipboardList size={13} />
                  <span>Bookings</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-tools" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                  <FaWrench size={12} />
                  <span>My Tools</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Right Actions & Demo Switcher */}
        <div className="navbar-actions">
          {/* Quick Demo Persona Switcher */}
          <div className="demo-switcher" title="College Project Demo: Switch Kerala Test User">
            <FaKey size={11} color="#D48C00" />
            <select value={user?.username || ''} onChange={handleDemoSwitch}>
              {demoAccounts.map(acc => (
                <option key={acc.id} value={acc.username}>
                  Demo: {acc.first_name} ({acc.profile.city})
                </option>
              ))}
            </select>
          </div>

          <Link to="/add-tool" className="btn btn-primary btn-sm">
            <FaPlus size={12} /> <span>Post Tool</span>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <img
                  src={user.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt="avatar"
                  style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.first_name || user.username}</span>
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-sm" title="Logout" style={{ padding: '0.45rem 0.6rem' }}>
                <FaSignOutAlt size={12} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <FaUser size={12} /> <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
