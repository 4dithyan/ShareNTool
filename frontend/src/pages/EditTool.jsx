import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toolService } from '../services/toolService';
import Loading from '../components/Loading';

const EditTool = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTool();
  }, [id]);

  const loadTool = async () => {
    try {
      setLoading(true);
      const data = await toolService.getToolById(id);
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await toolService.updateTool(id, {
        ...formData,
        price_per_day: parseFloat(formData.price_per_day),
        security_deposit: parseFloat(formData.security_deposit)
      });
      navigate(`/tools/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update tool');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading tool information for edit..." />;
  if (!formData) return <div className="container" style={{ padding: '3rem' }}>Tool not found</div>;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 720 }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Edit Tool Listing</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tool Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price Per Day (₹)</label>
              <input
                type="number"
                name="price_per_day"
                className="form-control"
                value={formData.price_per_day}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit (₹)</label>
              <input
                type="number"
                name="security_deposit"
                className="form-control"
                value={formData.security_deposit}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Availability Status</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.4rem' }}>
              <input
                type="checkbox"
                name="is_available"
                id="is_available"
                checked={formData.is_available}
                onChange={handleChange}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)' }}
              />
              <label htmlFor="is_available" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                Tool is currently available for neighbors to rent
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows={4}
              className="form-control"
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
              value={formData.rules_and_safety}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTool;

