import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Key, RotateCcw, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const MyBookings = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, [user]);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyRentals(user?.id);
      setRentals(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Active Rental</span>;
      case 'approved':
        return <span className="badge badge-info">Awaiting Pickup</span>;
      case 'returned':
        return <span className="badge badge-yellow">Returned & Closed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending Payment</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>My Tool Rentals</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Tools you have booked from neighbors. Track handover OTPs, returns, and deposit status.
        </p>
      </div>

      {loading ? (
        <Loading message="Loading rental bookings..." />
      ) : rentals.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '1.5rem' }}>
            You haven't rented any tools yet!
          </p>
          <Link to="/browse" className="btn btn-primary">
            Browse Nearby Tools
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {rentals.map(booking => (
            <div key={booking.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <img
                    src={booking.tool_details?.image_url}
                    alt="tool"
                    style={{ width: 84, height: 84, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem' }}>{booking.tool_details?.title}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.35rem' }}>
                      Owner: {booking.tool_details?.owner_details?.first_name || 'Neighbor'} ({booking.tool_details?.city})
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#1F2937' }}>
                      Duration: <strong>{booking.start_date}</strong> to <strong>{booking.end_date}</strong> ({booking.total_days} days)
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
                    {formatCurrency(booking.total_amount)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>
                    Includes {formatCurrency(booking.security_deposit)} Deposit
                  </span>
                </div>
              </div>

              {/* Handover & OTP Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', background: '#FAF9F5', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    Pickup Handover OTP
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#92400E' }}>
                      {booking.handover_otp}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      (Give to owner at pickup)
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                    Return OTP
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#065F46' }}>
                      {booking.return_otp}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      (Give to owner at return)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                {booking.status === 'pending' && (
                  <Link to={`/payment/${booking.id}`} className="btn btn-primary btn-sm">
                    Complete Dummy Payment
                  </Link>
                )}

                {booking.status === 'approved' && (
                  <Link to={`/handover/${booking.id}`} className="btn btn-primary btn-sm">
                    <Key size={14} /> Open Handover Screen
                  </Link>
                )}

                {booking.status === 'active' && (
                  <Link to={`/return-tool/${booking.id}`} className="btn btn-primary btn-sm">
                    <RotateCcw size={14} /> Return Tool to Owner
                  </Link>
                )}

                <Link to={`/damage-report/${booking.id}`} className="btn btn-secondary btn-sm" style={{ color: '#DC2626' }}>
                  <AlertTriangle size={14} /> Report Issue / Damage
                </Link>

                <Link to={`/tools/${booking.tool}`} className="btn btn-secondary btn-sm">
                  View Tool Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

