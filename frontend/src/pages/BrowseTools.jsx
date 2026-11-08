import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toolService } from '../services/toolService';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const BrowseTools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchTools();
  }, [category]);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (city) params.city = city;
      if (category) params.category = category;
      if (condition) params.condition = condition;
      if (maxPrice) params.max_price = maxPrice;

      const data = await toolService.getAllTools(params);
      const items = Array.isArray(data) ? data : (data.results || []);
      setTools(items);
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    fetchTools();
  };

  const handleCategoryPill = (catId) => {
    if (category === catId) {
      setCategory('');
    } else {
      setCategory(catId);
    }
  };

  const categoryPills = [
    { id: '', label: 'All Items' },
    { id: 'power-tools', label: '⚡ Power Tools' },
    { id: 'cleaning', label: '🧹 Vacuum Cleaners' },
    { id: 'ladders-scaffolding', label: '🪜 Ladders' },
    { id: 'gardening', label: '🌱 Lawn & Garden' },
    { id: 'painting', label: '🎨 Paint Sprayers' },
    { id: 'hand-tools', label: '🧰 Hand Toolkits' },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Browse Community Tools</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Rent verified equipment in your neighborhood directly from owners.
        </p>
      </div>

      {/* Main Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
          city={city}
          setCity={setCity}
          category={category}
          setCategory={setCategory}
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* Quick Category Filter Pills */}
      <div className="category-pill-list" style={{ marginBottom: '1.75rem' }}>
        {categoryPills.map(p => (
          <button
            key={p.id}
            type="button"
            className={`category-pill ${category === p.id ? 'active' : ''}`}
            onClick={() => handleCategoryPill(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Secondary Quick Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#FFFFFF', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <SlidersHorizontal size={15} color="#D48C00" /> Filter:
          </span>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', outline: 'none' }}
          >
            <option value="">Any Condition</option>
            <option value="brand_new">Brand New / Like New</option>
            <option value="good">Good Working</option>
            <option value="fair">Heavy Duty / Fair</option>
          </select>

          <input
            type="number"
            placeholder="Max Price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: 130, padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', outline: 'none' }}
          />

          <button onClick={fetchTools} className="btn btn-secondary btn-sm">
            Apply Filters
          </button>
        </div>

        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
          Showing <span style={{ color: '#1F2937' }}>{tools.length}</span> tools nearby
        </div>
      </div>

      {/* Tools Content Grid */}
      {loading ? (
        <Loading message="Filtering equipment..." />
      ) : tools.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '0.5rem' }}>
            No tools matched your current search criteria.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
            Try removing filters, searching for general terms like "drill" or "vacuum", or clearing location.
          </p>
          <button
            onClick={() => { setSearch(''); setCity(''); setCategory(''); setCondition(''); setMaxPrice(''); fetchTools(); }}
            className="btn btn-outline-primary"
          >
            <RefreshCw size={16} /> Reset All Filters
          </button>
        </div>
      ) : (
        <div className="tools-grid">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseTools;

