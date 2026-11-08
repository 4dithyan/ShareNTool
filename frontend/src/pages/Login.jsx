import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTools, FaKey, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('rahul_sharma');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const demoAccounts = [
    { username: 'rahul_sharma', name: 'Rahul Sharma (Owner & Renter)', role: 'South Delhi' },
    { username: 'priya_patel', name: 'Priya Patel (Ladders & Mowers)', role: 'Gurugram' },
    { username: 'amit_verma', name: 'Amit Verma (Garage & Sprayers)', role: 'Noida' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to login');
    }
  };

  const handleSelectDemo = (u) => {
    setUsername(u);
    setPassword('password123');
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: 480 }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-badge" style={{ margin: '0 auto 1rem', width: 44, height: 44 }}>
            <FaTools size={20} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            College Demo Login — pick a test user or enter credentials
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <FaExclamationCircle size={15} />
            {error}
          </div>
        )}

        {/* Quick Demo Selector */}
        <div style={{ background: 'var(--bg-accent-light)', border: '1px solid #FDE68A', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
            <FaKey size={13} color="#D48C00" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
              One-Click Demo Personas
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {demoAccounts.map(acc => (
              <button
                key={acc.username}
                type="button"
                onClick={() => handleSelectDemo(acc.username)}
                className={`btn btn-sm ${username === acc.username ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'space-between', fontSize: '0.825rem' }}
              >
                <span>{acc.name}</span>
                <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>{acc.role}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rahul_sharma"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In with Dummy Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don’t have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign up here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
