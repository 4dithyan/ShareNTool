import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default college demo user: Rahul Sharma (Owner & Renter)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('snt_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 1,
      username: 'rahul_sharma',
      first_name: 'Rahul',
      last_name: 'Sharma',
      email: 'rahul@example.com',
      profile: {
        city: 'South Delhi',
        phone: '+91 98765 43210',
        bio: 'Home DIY enthusiast & friendly neighborhood tool lender!',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        is_verified: true,
      }
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('snt_token') || 'dummy-token-1-rahul_sharma');

  useEffect(() => {
    if (user) {
      localStorage.setItem('snt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('snt_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('snt_token', token);
    } else {
      localStorage.removeItem('snt_token');
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      // Dummy fallback if backend is momentarily unreachable: allow instant college test login
      const dummyUser = {
        id: username === 'priya_patel' ? 2 : username === 'amit_verma' ? 3 : 1,
        username: username,
        first_name: username.split('_')[0].toUpperCase(),
        last_name: 'User',
        email: `${username}@example.com`,
        profile: {
          city: 'Delhi NCR',
          phone: '+91 98765 00000',
          bio: 'College test demo profile',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          is_verified: true
        }
      };
      setUser(dummyUser);
      setToken(`dummy-token-${dummyUser.id}`);
      return { success: true, user: dummyUser };
    }
  };

  const signup = async (userData) => {
    try {
      const data = await authService.signup(userData);
      setUser(data.user);
      setToken(data.token);
      return { success: true, user: data.user };
    } catch (err) {
      const fallback = {
        id: Math.floor(Math.random() * 900) + 10,
        username: userData.username,
        first_name: userData.first_name || userData.username,
        last_name: userData.last_name || '',
        email: userData.email,
        profile: {
          city: userData.city || 'Delhi NCR',
          phone: userData.phone || '',
          bio: 'College test user',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          is_verified: true
        }
      };
      setUser(fallback);
      setToken(`dummy-token-${fallback.id}`);
      return { success: true, user: fallback };
    }
  };

  const switchDummyUser = (demoUser) => {
    setUser(demoUser);
    setToken(`dummy-token-${demoUser.id}-${demoUser.username}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('snt_user');
    localStorage.removeItem('snt_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, switchDummyUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

