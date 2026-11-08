import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', maxWidth: 480 }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #FDE68A' }}>
        <Wrench size={30} color="#D48C00" />
      </div>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Tool Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The page you are looking for has been returned or does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to ShareNTool Home
      </Link>
    </div>
  );
};

export default NotFound;

