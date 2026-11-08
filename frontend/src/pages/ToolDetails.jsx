import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toolService } from '../services/toolService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import {
  FaMapMarkerAlt,
  FaShieldAlt,
  FaExclamationTriangle,
  FaStar,
  FaClock,
  FaArrowLeft
} from 'react-icons/fa';

const ToolDetails = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadToolData();
  }, [id]);

  const loadToolData = async () => {
    try {
      setLoading(true);
      const toolData = await toolService.getToolById(id);
      setTool(toolData);
      const revData = await toolService.getToolReviews(id);
      setReviews(Array.isArray(revData) ? revData : (revData.results || []));
    } catch (err) {
      console.error('Error fetching tool details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    setSubmittingReview(true);
    try {
      await toolService.addReview({
        tool_id: parseInt(id),
        user_id: user?.id || 1,
        rating: newRating,
        comment: newReviewText
      });
      setNewReviewText('');
      loadToolData();
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loading message="Loading tool information..." />;
  if (!tool) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Tool Not Found</h2>
        <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  const formatCurrency = (val) => `₹${parseFloat(val || 0).toLocaleString('en-IN')}`;
  const isOwner = user && tool.owner === user.id;

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        <FaArrowLeft size={14} /> Back to Listings
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column: Image, Description, Safety, Reviews */}
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#F4EFE6', maxHeight: 420, marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
            <img
              src={tool.image_url}
              alt={tool.title}
              style={{ width: '100%', height: 420, objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'; }}
            />
            <div style={{ position: 'absolute', top: 16, left: 16 }}>
              <span className="badge badge-yellow" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
                {tool.category?.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{tool.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#6B7280', fontSize: '0.925rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FaMapMarkerAlt size={15} color="#D48C00" /> {tool.locality}, {tool.city}
              </span>
              <span>•</span>
              <span>Brand: <strong>{tool.brand || 'Unspecified'}</strong></span>
              <span>•</span>
              <span>Condition: <strong>{tool.condition?.replace('_', ' ')}</strong></span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Description & Specs</h3>
            <p style={{ color: '#4B5563', lineHeight: 1.7, marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {tool.description}
            </p>

            {tool.rules_and_safety && (
              <div style={{ background: 'var(--bg-accent-light)', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#92400E', fontWeight: 700 }}>
                  <FaExclamationTriangle size={16} />
                  <span>Safety & Usage Guidelines from Owner</span>
                </div>
                <p style={{ color: '#78350F', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {tool.rules_and_safety}
                </p>
              </div>
            )}
          </div>

          {/* Owner Profile Banner */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={tool.owner_details?.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Owner"
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FCD34D' }}
              />
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
                  Listed by {tool.owner_details?.first_name || tool.owner_details?.username}
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#6B7280' }}>
                  Verified Neighbor • {tool.owner_details?.profile?.city || 'Kerala'}
                </p>
              </div>
            </div>
            <Link to={`/profile/${tool.owner}`} className="btn btn-secondary btn-sm">
              View Owner Profile
            </Link>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaStar size={18} color="#E59F00" /> Community Reviews ({reviews.length})
              </h3>
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                No reviews yet. Be the first neighbor to rent and review this tool!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} style={{ padding: '1rem', background: '#FAF9F5', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {rev.user_details?.first_name || rev.user_details?.username || 'Neighbor'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', color: '#D48C00', fontSize: '0.85rem', fontWeight: 700, gap: '0.2rem' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <FaStar key={i} size={12} color="#D48C00" />
                        ))}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review Box */}
            <form onSubmit={handleAddReview} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Leave a Review for this Tool</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Rating:</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Good/Average)</option>
                  <option value={2}>2 Stars (Below Expectation)</option>
                  <option value={1}>1 Star (Poor)</option>
                </select>
              </div>
              <textarea
                rows={3}
                className="form-control"
                placeholder="How was the tool condition and owner communication?"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
                style={{ marginBottom: '0.75rem' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={submittingReview}>
                {submittingReview ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div className="card" style={{ padding: '2rem', border: '1.5px solid #FCD34D' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1F2937' }}>
                  {formatCurrency(tool.price_per_day)}
                </span>
                <span style={{ color: '#6B7280', fontSize: '0.95rem' }}> / day</span>
              </div>
              <span className={`badge ${tool.is_available ? 'badge-success' : 'badge-warning'}`}>
                {tool.is_available ? 'Ready for Pickup' : 'Currently Rented'}
              </span>
            </div>

            <div style={{ background: '#FAF9F5', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#6B7280' }}>Refundable Security Deposit:</span>
                <span style={{ fontWeight: 700, color: '#1F2937' }}>{formatCurrency(tool.security_deposit)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#6B7280' }}>Handover Verification:</span>
                <span style={{ fontWeight: 700, color: '#065F46' }}>4-Digit Secret OTP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#6B7280' }}>Payment Protection:</span>
                <span style={{ fontWeight: 700, color: '#92400E' }}>Escrow Guarantee</span>
              </div>
            </div>

            {isOwner ? (
              <div>
                <div style={{ background: 'var(--bg-accent-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A', marginBottom: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>
                  You are the owner of this tool listing
                </div>
                <Link to={`/edit-tool/${tool.id}`} className="btn btn-secondary" style={{ width: '100%', marginBottom: '0.5rem' }}>
                  Edit Tool Details
                </Link>
              </div>
            ) : (
              <Link
                to={`/booking/${tool.id}`}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1rem', fontSize: '1.05rem' }}
              >
                Proceed to Book Rental
              </Link>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem', color: '#6B7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaShieldAlt size={15} color="#D48C00" />
                <span>Security deposit is fully refunded once tool is returned</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaClock size={15} color="#D48C00" />
                <span>Standard pickup timings: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetails;
