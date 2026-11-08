import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toolService } from '../services/toolService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaPlusCircle, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';

const MyTools = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyTools();
  }, [user]);

  const loadMyTools = async () => {
    try {
      setLoading(true);
      const data = await toolService.getMyTools(user?.id);
      setTools(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this tool listing?')) return;
    try {
      await toolService.deleteTool(id);
      setTools(tools.filter(t => t.id !== id));
    } catch (err) {
      alert('Could not delete tool');
    }
  };

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>My Listed Tools</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage the equipment you have made available for neighbors in {user?.profile?.city || 'Kochi, Kerala'}.
          </p>
        </div>
        <Link to="/add-tool" className="btn btn-primary">
          <FaPlusCircle size={14} /> Add New Tool
        </Link>
      </div>

      {loading ? (
        <Loading message="Loading your tool portfolio..." />
      ) : tools.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '1.5rem' }}>
            You haven't listed any equipment yet!
          </p>
          <Link to="/add-tool" className="btn btn-primary">
            List Your First Tool for Rent
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {tools.map(tool => (
            <div key={tool.id} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <img
                  src={tool.image_url}
                  alt={tool.title}
                  style={{ width: 90, height: 90, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{tool.title}</h3>
                    <span className={`badge ${tool.is_available ? 'badge-success' : 'badge-warning'}`}>
                      {tool.is_available ? 'Available' : 'Rented Out'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.4rem' }}>
                    {tool.locality}, {tool.city} • Category: {tool.category}
                  </p>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>
                    {formatCurrency(tool.price_per_day)} / day • Deposit: {formatCurrency(tool.security_deposit)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Link to={`/tools/${tool.id}`} className="btn btn-secondary btn-sm" title="Preview Public Page">
                  <FaEye size={13} /> View
                </Link>
                <Link to={`/edit-tool/${tool.id}`} className="btn btn-secondary btn-sm" title="Edit Listing">
                  <FaEdit size={13} /> Edit
                </Link>
                <button onClick={() => handleDelete(tool.id)} className="btn btn-sm btn-secondary" style={{ color: '#EF4444' }} title="Delete Listing">
                  <FaTrashAlt size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTools;
