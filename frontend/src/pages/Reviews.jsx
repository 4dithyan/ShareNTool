import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toolService } from '../services/toolService';
import Loading from '../components/Loading';
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
  const [searchParams] = useSearchParams();
  const toolId = searchParams.get('tool_id');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [toolId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await toolService.getToolReviews(toolId);
      setReviews(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: 760 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Neighbor Feedback & Reviews</h1>
        <p style={{ color: 'var(--text-muted)' }}>Community ratings helping neighbors rent with peace of mind</p>
      </div>

      {loading ? (
        <Loading message="Loading feedback..." />
      ) : reviews.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#6B7280' }}>No reviews recorded for this filter.</p>
          <Link to="/browse" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Browse Other Tools
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map(rev => (
            <div key={rev.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', marginBottom: '0.15rem' }}>
                    {rev.user_details?.first_name || rev.user_details?.username}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Reviewed tool: #{rev.tool}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <FaStar key={i} size={14} color="#D48C00" />
                  ))}
                </div>
              </div>
              <p style={{ color: '#374151', fontSize: '0.925rem' }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
