import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading tools and details...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3.5rem 1rem' }}>
      <Loader2 size={36} color="#E59F00" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '1rem', color: '#6B7280', fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;

