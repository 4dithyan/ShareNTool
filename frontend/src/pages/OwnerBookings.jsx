import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaKey, FaUndo, FaCheck, FaTimes } from 'react-icons/fa';

const OwnerBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getOwnerBookings(user?.id);
      setBookings(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingService.updateStatus(id, status);
      loadBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Received Tool Bookings</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Rentals requested by neighbors for your listed equipment. Verify handovers and returns.
        </p>
      </div>

      {loading ? (
        <Loading message="Fetching booking requests..." />
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '1.5rem' }}>
            No neighbors have booked your tools yet.
          </p>
          <Link to="/browse" className="btn btn-secondary">
            Check Local Market
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <img
                    src={booking.tool_details?.image_url}
                    alt="tool"
                    style={{ width: 84, height: 84, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{booking.tool_details?.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.35rem' }}>
                      Renter: <strong>{booking.renter_details?.first_name || booking.renter_details?.username}</strong> ({booking.renter_details?.profile?.phone || 'No phone'})
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#1F2937' }}>
                      Booking Dates: {booking.start_date} to {booking.end_date} ({booking.total_days} days)
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
                    {formatCurrency(booking.total_amount)}
                  </div>
                  <span className={`badge ${booking.status === 'active' ? 'badge-success' : 'badge-yellow'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {booking.notes && (
                <div style={{ background: '#FAF9F5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <strong>Renter's Note:</strong> {booking.notes}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                {booking.status === 'pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(booking.id, 'approved')} className="btn btn-primary btn-sm">
                      <FaCheck size={12} /> Accept Request
                    </button>
                    <button onClick={() => handleUpdateStatus(booking.id, 'cancelled')} className="btn btn-secondary btn-sm" style={{ color: '#EF4444' }}>
                      <FaTimes size={12} /> Decline
                    </button>
                  </>
                )}

                {booking.status === 'approved' && (
                  <Link to={`/handover/${booking.id}`} className="btn btn-primary btn-sm">
                    <FaKey size={13} /> Verify Handover (Input Renter's OTP)
                  </Link>
                )}

                {booking.status === 'active' && (
                  <Link to={`/return-tool/${booking.id}`} className="btn btn-primary btn-sm">
                    <FaUndo size={13} /> Verify Return & Refund Deposit
                  </Link>
                )}

                <Link to={`/damage-report/${booking.id}`} className="btn btn-secondary btn-sm" style={{ color: '#DC2626' }}>
                  Report Damage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
