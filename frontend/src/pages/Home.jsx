import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toolService } from '../services/toolService';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Banknote,
  Search,
  ArrowRight,
  CheckCircle2,
  Users,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedTools();
  }, []);

  const fetchFeaturedTools = async () => {
    try {
      setLoading(true);
      const data = await toolService.getAllTools();
      // Handle list or paginated response
      const items = Array.isArray(data) ? data : (data.results || []);
      setTools(items.slice(0, 6));
    } catch (err) {
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(`/browse?search=${encodeURIComponent(search)}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`);
  };

  const categories = [
    { id: 'power-tools', name: 'Power Tools', icon: '⚡', desc: 'Drills, saws, sanders' },
    { id: 'cleaning', name: 'Wet & Dry Vacuums', icon: '🧹', desc: 'Deep cleaners & steamers' },
    { id: 'ladders-scaffolding', name: 'Ladders & Heights', icon: '🪜', desc: 'Step ladders, extensions' },
    { id: 'gardening', name: 'Gardening & Mowers', icon: '🌱', desc: 'Lawn mowers & trimmers' },
    { id: 'painting', name: 'Paint & Sprayers', icon: '🎨', desc: 'Airless spray guns & rollers' },
    { id: 'hand-tools', name: 'Hand Toolkits', icon: '🧰', desc: 'Mechanic sockets & wrenches' },
  ];

  return (
    <div>
      {/* Soft Yellow / White Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge-pill">
                <Sparkles size={15} color="#D48C00" />
                <span>The OLX of Tool Rentals • College Project Demo</span>
              </div>

              <h1 className="hero-title">
                Don’t Buy It for One Use. <br />
                <span className="highlight">Rent Tools</span> from Neighbors.
              </h1>

              <p className="hero-description">
                Borrow power drills, vacuum cleaners, step ladders, and lawn mowers from people right in your locality. Save money, declutter homes, and finish weekend DIY projects effortlessly.
              </p>

              {/* Instant Search Bar */}
              <div style={{ maxWidth: 620, marginBottom: '1.5rem' }}>
                <SearchBar
                  search={search}
                  setSearch={setSearch}
                  city={city}
                  setCity={setCity}
                  category={category}
                  setCategory={setCategory}
                  onSearch={handleSearch}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/browse" className="btn btn-primary btn-lg">
                  Explore Nearby Tools <ArrowRight size={18} />
                </Link>
                <Link to="/add-tool" className="btn btn-secondary btn-lg">
                  List Your Spare Tool
                </Link>
              </div>

              <div className="hero-stats">
                <div className="hero-stat-item">
                  <h4>₹199+</h4>
                  <p>Daily Rental Starting</p>
                </div>
                <div className="hero-stat-item">
                  <h4>100%</h4>
                  <p>Refundable Deposit</p>
                </div>
                <div className="hero-stat-item">
                  <h4>OTP Verified</h4>
                  <p>Secure Handover</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Preview Card */}
            <div>
              <div className="hero-card-preview">
                <div className="badge badge-yellow hero-card-tag">
                  Featured in South Delhi
                </div>
                <img
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
                  alt="Bosch Drill Kit"
                  style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem' }}>Bosch GSB 600W Hammer Drill Kit</h3>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1F2937' }}>₹249<span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#6B7280' }}>/day</span></span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Includes 100-piece accessory kit. Verified owner Rahul Sharma with 5.0 ★ rating.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--bg-accent-light)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600, display: 'block' }}>Handover Code</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1F2937' }}>OTP Protected</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 600, display: 'block' }}>Deposit Security</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065F46' }}>Escrow Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '4.5rem 0 3.5rem', borderBottom: '1px solid var(--border-color)', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>Simple 4-Step Flow</span>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>How ShareNTool Operates</h2>
            <p style={{ color: 'var(--text-muted)' }}>Like OLX, but built specifically for short-term tool borrowing with safety deposits and pickup OTPs.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Search size={24} color="#D48C00" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. Find Nearby Tool</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Browse tools in your locality. Check daily rent, photos, and safety notes.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Banknote size={24} color="#D48C00" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. Book & Dummy Pay</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pick rental dates. Total rent + refundable deposit are held securely in escrow.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={24} color="#D48C00" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. Handover with OTP</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Meet the neighbor, inspect the equipment, and exchange the 4-digit pickup OTP.</p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <RotateCcw size={24} color="#D48C00" />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>4. Return & Deposit Back</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Return tool after use. Owner inputs return OTP and your deposit is refunded!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories Grid */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Popular Categories</span>
              <h2 style={{ fontSize: '2.25rem' }}>Browse by Equipment Type</h2>
            </div>
            <Link to="/browse" className="btn btn-secondary">
              View All Tools <ChevronRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/browse?category=${c.id}`}
                className="card"
                style={{ padding: '1.25rem', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>{c.icon}</div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{c.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Showcase */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Recently Listed</span>
              <h2 style={{ fontSize: '2.25rem' }}>Available for Rent Today</h2>
            </div>
            <Link to="/browse" className="btn btn-primary">
              Browse All Listings <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loading message="Fetching verified tools in your city..." />
          ) : tools.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No tools listed yet.</p>
              <Link to="/add-tool" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Post First Tool
              </Link>
            </div>
          ) : (
            <div className="tools-grid">
              {tools.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

