import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const ToolCard = ({ tool }) => {
  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="tool-card">
      <div className="tool-card-img-wrap">
        <img
          src={tool.image_url || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'}
          alt={tool.title}
          className="tool-card-img"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="tool-card-price-tag">
          {formatCurrency(tool.price_per_day)} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6B7280' }}>/ day</span>
        </div>
      </div>

      <div className="tool-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
            {tool.category?.replace('-', ' ')}
          </span>
          {tool.is_available ? (
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              <FaCheckCircle size={11} /> Available
            </span>
          ) : (
            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
              Rented Out
            </span>
          )}
        </div>

        <Link to={`/tools/${tool.id}`}>
          <h3 className="tool-card-title">{tool.title}</h3>
        </Link>

        <div className="tool-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FaMapMarkerAlt size={13} color="#D48C00" />
            {tool.locality ? `${tool.locality}, ${tool.city}` : tool.city}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {tool.description}
        </p>

        <div className="tool-card-footer">
          <div>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'block' }}>Deposit (Refundable)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1F2937' }}>{formatCurrency(tool.security_deposit)}</span>
          </div>
          <Link to={`/tools/${tool.id}`} className="btn btn-primary btn-sm">
            Rent Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
