import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolService } from '../services/toolService';
import { useAuth } from '../context/AuthContext';

const AddTool = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'power-tools',
    brand: '',
    price_per_day: '',
    security_deposit: '',
    city: user?.profile?.city || 'Kochi',
    locality: '',
    condition: 'good',
    image_url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    description: '',
    rules_and_safety: 'Please wear safety glasses. Handle with care and return in clean condition.'
  });

  const [loading, setLoading] = useState(false);

  const sampleImages = [
    { label: 'Drill Machine', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Wet/Dry Vacuum', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80' },
    { label: 'Aluminum Ladder', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lawn Mower', url: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=800&q=80' },
    { label: 'Hand Toolkit', url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80' },
    { label: 'Paint Sprayer', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price_per_day: parseFloat(formData.price_per_day),
        security_deposit: parseFloat(formData.security_deposit || 500),
        owner_id: user?.id || 1
      };
      await toolService.createTool(payload);
      navigate('/my-tools');
    } catch (err) {
      console.error('Failed to create tool:', err);
      alert('Error creating tool listing. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 760 }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Earn from idle home tools</span>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>List a Tool for Rent</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Help neighbors tackle their home improvement projects safely while making extra cash.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tool Title / Model *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Bosch 600W Impact Drill or Karcher Wet/Dry Vacuum"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                <option value="power-tools">Power Tools (Drills, Saws)</option>
                <option value="cleaning">Cleaning & Wet/Dry Vacuums</option>
                <option value="ladders-scaffolding">Ladders & Heights</option>
                <option value="gardening">Gardening & Lawn Mowers</option>
                <option value="hand-tools">Hand Tools & Toolkits</option>
                <option value="painting">Painting & Decorating</option>
                <option value="others">Other Equipment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand / Manufacturer</label>
              <input
                type="text"
                name="brand"
                className="form-control"
                placeholder="e.g. Bosch, Karcher, Stanley"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Daily Rent Price (₹) *</label>
              <input
                type="number"
                name="price_per_day"
                className="form-control"
                placeholder="e.g. 250"
                value={formData.price_per_day}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Deposit (₹) *</label>
              <input
                type="number"
                name="security_deposit"
                className="form-control"
                placeholder="e.g. 500 (Refundable)"
                value={formData.security_deposit}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Locality / Neighborhood *</label>
              <input
                type="text"
                name="locality"
                className="form-control"
                placeholder="e.g. Kaloor, Edappally, or Pattom"
                value={formData.locality}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>
            <select name="condition" className="form-control" value={formData.condition} onChange={handleChange}>
              <option value="brand_new">Brand New / Mint Condition</option>
              <option value="good">Good Working Condition</option>
              <option value="fair">Fair / Heavy Duty Used</option>
            </select>
          </div>

          {/* Quick Image Picker or Custom URL */}
          <div className="form-group">
            <label className="form-label">Tool Image URL</label>
            <input
              type="url"
              name="image_url"
              className="form-control"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Paste direct image link"
              required
            />
            <div style={{ marginTop: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#6B7280', display: 'block', marginBottom: '0.35rem' }}>
                Or select one of our demo tool stock photos:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {sampleImages.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, image_url: s.url })}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & What's Included *</label>
            <textarea
              name="description"
              rows={4}
              className="form-control"
              placeholder="Describe the tool, included attachments, accessories, battery chargers, cable length, etc."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Safety & Handover Instructions</label>
            <textarea
              name="rules_and_safety"
              rows={2}
              className="form-control"
              placeholder="e.g. Please wear safety goggles. Do not submerge motor in water. Clean before returning."
              value={formData.rules_and_safety}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing Tool...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTool;
