import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

const DamageReport = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueTitle, setIssueTitle] = useState('');
  const [description, setDescription] = useState('');
  const [damageFee, setDamageFee] = useState('300');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingService.reportDamage({
        booking: parseInt(bookingId),
        reported_by_id: user?.id || 1,
        issue_title: issueTitle,
        description: description,
        damage_fee_requested: parseFloat(damageFee || 0),
        evidence_image_url: evidenceUrl,
        status: 'under_review'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Error submitting report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading damage resolution desk..." />;

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: 640 }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid #FECACA' }}>
            <AlertTriangle size={26} color="#DC2626" />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>Report Tool Damage / Issue</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Booking #{bookingId} • {booking?.tool_details?.title}
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} color="#10B981" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#065F46', marginBottom: '0.5rem' }}>
              Report Logged Under Escrow Review
            </h3>
            <p style={{ color: '#4B5563', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              Our simulated mediation desk has held the deposit deduction for inspection. Both owner and renter have been notified.
            </p>
            <button onClick={() => navigate('/my-rentals')} className="btn btn-primary">
              Return to My Rentals
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Headline / Malfunction *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Broken drill chuck / cracked casing"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Explanation *</label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Describe what occurred, any missing components, or physical damage observed."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Repair or Replacement Claim (₹)</label>
              <input
                type="number"
                className="form-control"
                value={damageFee}
                onChange={(e) => setDamageFee(e.target.value)}
                placeholder="e.g. 300"
              />
              <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Capped at maximum security deposit of ₹{booking?.security_deposit || 500}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Damage Evidence Photo Link</label>
              <input
                type="url"
                className="form-control"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-danger" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Damage Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DamageReport;

