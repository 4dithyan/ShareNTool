import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toolService } from '../services/toolService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Calendar, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

const Booking = () => {
  const { toolId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Default start date today, end date tomorrow
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(tomorrow);

    loadTool();
  }, [toolId]);

  const loadTool = async () => {
    try {
      setLoading(true);
      const data = await toolService.getToolById(toolId);
      setTool(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const days = calculateDays();
  const dailyPrice = tool ? parseFloat(tool.price_per_day) : 0;
  const rentAmount = dailyPrice * days;
  const securityDeposit = tool ? parseFloat(tool.security_deposit) : 0;
  const totalAmount = rentAmount + securityDeposit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        tool_id: parseInt(toolId),
        renter_id: user?.id || 1,
        start_date: startDate,
        end_date: endDate,
        total_days: days,
        rent_amount: rentAmount,
        security_deposit: securityDeposit,
        total_amount: totalAmount,
        notes: notes || 'College test rental booking',
        status: 'pending'
      };

      const newBooking = await bookingService.createBooking(payload);
      // Redirect straight to dummy payment gateway
      navigate(`/payment/${newBooking.id}`);
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Error booking tool. Please check your dates.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Preparing rental agreement..." />;
  if (!tool) return <div className="container" style={{ padding: '3rem' }}>Tool not found</div>;

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 840 }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Reserve Equipment</span>
        <h1 style={{ fontSize: '2rem' }}>Book Rental for {tool.title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Choose your pickup and return dates</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Rental Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Rental End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Pickup & Handover Note for Owner</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="e.g. I will come pick it up on Saturday at 10 AM. Will bring car trunk."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ background: '#FAF9F5', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#1F2937', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={15} color="#D48C00" /> Handover OTP Security
              </div>
              <p style={{ color: '#6B7280' }}>
                Once your payment is authorized in escrow, you will receive a 4-digit pickup code. Hand this to the owner during inspection to release the equipment.
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Creating Booking...' : 'Proceed to Payment Gateway'} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Right Summary Card */}
        <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF', border: '1.5px solid #FCD34D' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
            <img
              src={tool.image_url}
              alt={tool.title}
              style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
            />
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{tool.title}</h4>
              <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{tool.locality}, {tool.city}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#6B7280' }}>Daily Rate</span>
              <span>{formatCurrency(dailyPrice)} / day</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#6B7280' }}>Rental Duration</span>
              <span><strong>{days} {days === 1 ? 'day' : 'days'}</strong></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#6B7280' }}>Rent Subtotal</span>
              <span>{formatCurrency(rentAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#6B7280' }}>Refundable Deposit</span>
              <span style={{ color: '#065F46', fontWeight: 600 }}>{formatCurrency(securityDeposit)}</span>
            </div>
          </div>

          <div style={{ borderTop: '1.5px dashed var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Total Payable</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-contrast)' }}>
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div style={{ background: 'var(--bg-accent-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', fontSize: '0.775rem', color: '#92400E' }}>
            ✓ Deposit returned within 24 hours of safe tool return.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

