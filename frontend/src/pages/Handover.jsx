import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Key, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const Handover = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    try {
      const res = await bookingService.verifyHandover(bookingId, otpInput);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please check the code.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <Loading message="Loading handover safety check..." />;
  if (!booking) return <div className="container" style={{ padding: '3rem' }}>Booking not found</div>;

  const isOwner = user && booking.tool_details?.owner === user.id;

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: 680 }}>
      <Link to="/my-rentals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Rentals
      </Link>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #FDE68A' }}>
            <Key size={26} color="#D48C00" />
          </div>
          <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Step 3 • Physical Pickup</span>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Tool Handover Verification</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {booking.tool_details?.title}
          </p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#065F46', marginBottom: '0.5rem' }}>Handover Verified!</h2>
            <p style={{ color: '#4B5563', marginBottom: '2rem' }}>
              The equipment is now officially marked as <strong>ACTIVE</strong> in rental custody.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/my-rentals" className="btn btn-primary">
                Go to My Rentals
              </Link>
              <Link to="/owner-bookings" className="btn btn-secondary">
                Owner Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Context Box */}
            <div style={{ background: '#FAF9F5', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Expected Handover OTP:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400E' }}>
                  {booking.handover_otp}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#6B7280' }}>
                {isOwner
                  ? "As the tool owner, ask the renter for their 4-digit code and enter it below to confirm you handed over the tool."
                  : "As the renter, provide the 4-digit code above to the owner so they can verify equipment handover."}
              </p>
            </div>

            {error && (
              <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <div className="form-group" style={{ textAlign: 'center' }}>
                <label className="form-label" style={{ marginBottom: '0.75rem' }}>
                  Enter 4-Digit Handover OTP (or use <strong>{booking.handover_otp}</strong>):
                </label>
                <input
                  type="text"
                  maxLength={6}
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    maxWidth: 240,
                    margin: '0 auto',
                    padding: '0.5rem 1rem'
                  }}
                  className="form-control"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="0000"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem' }}
                disabled={verifying}
              >
                {verifying ? 'Verifying OTP...' : 'Verify & Release Equipment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Handover;

