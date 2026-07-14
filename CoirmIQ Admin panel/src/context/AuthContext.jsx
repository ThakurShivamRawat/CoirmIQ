import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setContextToken } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('antigravity_token');
    if (savedToken) {
      setContextToken(savedToken);
    }
    return savedToken;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('antigravity_admin_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token, we could perform a quick check, but for now we just rely on presence of token
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    // Hidden Role Payload: automatically bundle role: "ADMIN"
    const response = await api.post('/api/v1/auth/login', {
      email,
      password,
      role: 'ADMIN',
    });
    
    // Response layout: ApiResponse { success: boolean, message: string, data: AuthResponse { token, user } }
    const { success, data } = response.data;
    if (success && data) {
      const { token: jwtToken, user: userProfile } = data;
      
      // Ensure user role is indeed ADMIN
      if (userProfile.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      localStorage.setItem('antigravity_token', jwtToken);
      localStorage.setItem('antigravity_admin_user', JSON.stringify(userProfile));
      
      setContextToken(jwtToken);
      setToken(jwtToken);
      setUser(userProfile);
      return userProfile;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('antigravity_token');
    localStorage.removeItem('antigravity_admin_user');
    setContextToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
