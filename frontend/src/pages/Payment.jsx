import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import Loading from '../components/Loading';
import { 
  FaShieldAlt, 
  FaCreditCard, 
  FaMobileAlt, 
  FaMoneyBillWave, 
  FaCheckCircle 
} from 'react-icons/fa';

const Payment = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('neighbor@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [processing, setProcessing] = useState(false);
  const [successData, setSuccessData] = useState(null);

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

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await paymentService.processDummyPayment({
        booking_id: parseInt(bookingId),
        payment_method: paymentMethod,
        amount: booking.total_amount
      });
      setSuccessData(res);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment processing failed in demo mode.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading message="Loading booking details for payment..." />;
  if (!booking) return <div className="container" style={{ padding: '3rem' }}>Booking not found</div>;

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;

  if (successData) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: 600 }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '2px solid #10B981' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <FaCheckCircle size={32} color="#10B981" />
          </div>

          <h1 style={{ fontSize: '1.8rem', color: '#065F46', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h1>
          <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Transaction ID: <strong>{successData.transaction_id}</strong>
          </p>

          <div style={{ background: '#FAF9F5', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#1F2937' }}>Handover Code for Pickup:</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-accent-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
              <span style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 600 }}>Your Secret Pickup OTP:</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.2em', color: '#1F2937' }}>
                {booking.handover_otp}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.65rem' }}>
              Show this 4-digit code to the tool owner when picking up the tool to activate your rental.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/my-rentals" className="btn btn-primary">
              View My Rentals
            </Link>
            <Link to={`/handover/${booking.id}`} className="btn btn-secondary">
              Handover Verification Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: 840 }}>
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-yellow" style={{ marginBottom: '0.5rem' }}>Dummy Payment Gateway</span>
        <h1 style={{ fontSize: '2rem' }}>Secure Checkout & Escrow Deposit</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          College Project Simulation — No real money is charged.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
        {/* Payment Methods Selection */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Choose Payment Method</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
            {/* UPI Option */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: paymentMethod === 'upi' ? 'var(--bg-accent-light)' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <FaMobileAlt size={20} color="#D48C00" />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>UPI (Google Pay / PhonePe / Paytm)</strong>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Instant verification via simulated UPI handle</span>
              </div>
            </label>

            {/* Dummy Card Option */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: paymentMethod === 'card' ? 'var(--bg-accent-light)' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <FaCreditCard size={18} color="#D48C00" />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Credit / Debit Card (Demo)</strong>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Visa, MasterCard, RuPay dummy test card</span>
              </div>
            </label>

            {/* Cash on Handover */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: paymentMethod === 'cash_on_pickup' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: paymentMethod === 'cash_on_pickup' ? 'var(--bg-accent-light)' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_pickup"
                checked={paymentMethod === 'cash_on_pickup'}
                onChange={() => setPaymentMethod('cash_on_pickup')}
                style={{ accentColor: 'var(--primary)' }}
              />
              <FaMoneyBillWave size={18} color="#D48C00" />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Pay Cash to Owner at Pickup</strong>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Pay directly during physical handover</span>
              </div>
            </label>
          </div>

          {/* Conditional field */}
          {paymentMethod === 'upi' && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Dummy UPI ID</label>
              <input
                type="text"
                className="form-control"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. mobile@upi"
              />
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Dummy Card Number</label>
              <input
                type="text"
                className="form-control"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
          )}

          <button onClick={handlePay} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={processing}>
            {processing ? 'Authorizing in Escrow...' : `Pay & Authorize ${formatCurrency(booking.total_amount)}`}
          </button>
        </div>

        {/* Breakdown Card */}
        <div className="card" style={{ padding: '1.75rem', border: '1.5px solid #FCD34D' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Rental Order Summary</h4>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
            {booking.tool_details?.title}
          </p>
          <p style={{ fontSize: '0.825rem', color: '#6B7280', marginBottom: '1rem' }}>
            Dates: {booking.start_date} to {booking.end_date} ({booking.total_days} days)
          </p>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6B7280' }}>Rent Amount:</span>
              <span>{formatCurrency(booking.rent_amount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6B7280' }}>Refundable Security Deposit:</span>
              <span style={{ color: '#065F46', fontWeight: 600 }}>{formatCurrency(booking.security_deposit)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6B7280' }}>Convenience Fee:</span>
              <span style={{ color: '#10B981' }}>₹0.00 (Demo Waived)</span>
            </div>
          </div>

          <div style={{ borderTop: '1.5px dashed var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Due Now:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-contrast)' }}>
              {formatCurrency(booking.total_amount)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-accent-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', fontSize: '0.775rem', color: '#92400E' }}>
            <FaShieldAlt size={14} />
            <span>Escrow protected. Security deposit refunded upon verified return.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
