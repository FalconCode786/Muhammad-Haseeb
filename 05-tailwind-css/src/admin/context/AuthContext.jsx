import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');

      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const normalized = parsed?.id ? parsed : { ...parsed, id: parsed?._id };
          setUser(normalized);
          if (normalized?.id && normalized?.id !== parsed?.id) {
            localStorage.setItem('adminUser', JSON.stringify(normalized));
          }
        } catch (err) {
          console.log('Parse error:', err);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        const { token, user } = res.data.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }

      return { success: false, message: 'Login failed' };

    } catch (err) {
      console.log('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  // Context value
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
