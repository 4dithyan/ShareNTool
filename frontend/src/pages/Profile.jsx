import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaMapMarkerAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const targetId = userId || currentUser?.id;

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    bio: ''
  });

  useEffect(() => {
    loadProfile();
  }, [targetId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile(targetId);
      setProfileData(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.profile?.phone || '',
        city: data.profile?.city || 'South Delhi',
        bio: data.profile?.bio || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({
        user_id: targetId,
        ...formData
      });
      setSavedMsg(true);
      setEditing(false);
      loadProfile();
      setTimeout(() => setSavedMsg(false), 3000);
    } catch (err) {
      alert('Could not update profile');
    }
  };

  if (loading) return <Loading message="Loading profile..." />;
  if (!profileData) return <div className="container" style={{ padding: '3rem' }}>User profile not found</div>;

  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: 760 }}>
      {savedMsg && (
        <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <FaCheckCircle size={16} /> Profile details saved successfully!
        </div>
      )}

      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={profileData.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #FCD34D' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>
                  {profileData.first_name} {profileData.last_name || profileData.username}
                </h1>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                  <FaShieldAlt size={11} /> Verified
                </span>
              </div>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaMapMarkerAlt size={14} color="#D48C00" /> {profileData.profile?.city || 'Delhi NCR'}
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-secondary btn-sm"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">About / Bio</label>
              <textarea
                rows={3}
                className="form-control"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Save Profile Updates
            </button>
          </form>
        ) : (
          <div>
            <div style={{ background: '#FAF9F5', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: '#1F2937' }}>Bio</h4>
              <p style={{ color: '#4B5563', fontSize: '0.925rem' }}>
                {profileData.profile?.bio || 'Passionate about sharing quality home tools with neighbors.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>Email</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profileData.email}</span>
              </div>
              <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>Phone</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profileData.profile?.phone || 'Verified'}</span>
              </div>
              <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>Trust Level</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#D48C00' }}>Top Contributor</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
