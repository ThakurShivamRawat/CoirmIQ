import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setContextToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('antigravity_host_token'));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('antigravity_host_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [errorNotification, setErrorNotification] = useState(null);

  useEffect(() => {
    setContextToken(token);
    // Check if token and user match
    if (token && !user) {
      // If token exists but user info is missing, clear
      logout();
    }
    setLoading(false);
  }, [token, user]);

  const showNotification = (message, type = 'error') => {
    setErrorNotification({ message, type });
    // Auto-diminish after 5 seconds
    setTimeout(() => {
      setErrorNotification(null);
    }, 5000);
  };

  const login = async (email, password) => {
    try {
      setErrorNotification(null);
      // Automatically inject role: HOST as required
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
        role: 'HOST'
      });

      const { token: receivedToken, user: receivedUser } = response.data.data;
      
      localStorage.setItem('antigravity_host_token', receivedToken);
      localStorage.setItem('antigravity_host_user', JSON.stringify(receivedUser));
      
      setContextToken(receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      showNotification(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const register = async (email, username, password, mobNo) => {
    try {
      setErrorNotification(null);
      // Automatically append role: HOST as required
      const response = await api.post('/api/v1/auth/register', {
        email,
        username,
        password,
        mobNo,
        role: 'HOST'
      });

      const { token: receivedToken, user: receivedUser } = response.data.data;
      
      localStorage.setItem('antigravity_host_token', receivedToken);
      localStorage.setItem('antigravity_host_user', JSON.stringify(receivedUser));
      
      setContextToken(receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed. Please check fields.';
      showNotification(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('antigravity_host_token');
    localStorage.removeItem('antigravity_host_user');
    setContextToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        errorNotification,
        setErrorNotification,
        showNotification,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
