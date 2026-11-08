import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-badge">
                <Wrench size={20} />
              </div>
              <span>Share<span style={{ color: 'var(--primary)' }}>N</span>Tool</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '320px', marginBottom: '1.25rem' }}>
              The neighborhood peer-to-peer equipment sharing marketplace. Rent quality power tools, ladders, vacuums, and DIY gear from verified neighbors nearby.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-accent-light)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
              <ShieldCheck size={16} color="#D48C00" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>Escrow Deposit Protected & Verified Neighbors</span>
            </div>
          </div>

          <div className="footer-col">
            <h5>Explore Tools</h5>
            <ul>
              <li><Link to="/browse?category=power-tools">Power Drills & Saws</Link></li>
              <li><Link to="/browse?category=cleaning">Wet/Dry Vacuum Cleaners</Link></li>
              <li><Link to="/browse?category=ladders-scaffolding">Ladders & Heights</Link></li>
              <li><Link to="/browse?category=gardening">Lawn Mowers & Trimmers</Link></li>
              <li><Link to="/browse?category=painting">Paint Sprayers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>How It Works</h5>
            <ul>
              <li><Link to="/browse">Search Local Listings</Link></li>
              <li><Link to="/add-tool">Rent Out Your Spare Tools</Link></li>
              <li><a href="#how-it-works">Handover OTP Safety Check</a></li>
              <li><a href="#security">Refundable Security Deposit</a></li>
              <li><Link to="/login">College Demo Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>College Project Info</h5>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="#E59F00" /> Delhi NCR, India
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="#E59F00" /> project@sharentool.local
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} color="#E59F00" /> +91 (Demo) 98765-TOOL
              </li>
              <li style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#6B7280' }}>
                Built with Django REST Framework, SQLite, React & Vite.
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShareNTool. Designed for College Project Presentation with soft yellow aesthetic.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#EF4444" fill="#EF4444" /> for Sustainable Neighborhoods
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

