import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OAuth2Redirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const emailParam = params.get('email');
    const usernameParam = params.get('username');

    if (token) {
      // Store the secure JWT token in localStorage
      localStorage.setItem('antigravity_user_token', token);

      // Lightweight native utility to decode JWT claims safely without external libraries
      let decodedClaims = null;
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        decodedClaims = JSON.parse(window.atob(base64));
      } catch (error) {
        console.error('Error parsing security token claims:', error);
      }

      // Extract details dynamically from JWT or fallback onto query parameters safely
      const parsedUser = {
        id: decodedClaims?.id || decodedClaims?.sub || 'usr-google-' + Math.random().toString(36).substring(2, 9),
        username: decodedClaims?.username || decodedClaims?.name || usernameParam || (emailParam ? emailParam.split('@')[0] : 'GoogleUser'),
        email: decodedClaims?.email || emailParam || 'oauth.user@gmail.com',
        role: decodedClaims?.role || 'USER',
        mobNo: decodedClaims?.mobNo || '',
        city: decodedClaims?.city || 'Visitor'
      };
      localStorage.setItem('antigravity_user', JSON.stringify(parsedUser));

      // Notify user of success
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: `Google Sign In successful. Welcome, ${parsedUser.username}!`, type: 'success' }
      }));

      // Strip the parameters out of the active window history bar and navigate to home
      navigate('/', { replace: true });
    } else {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Authentication error: No secure token was found in redirect.', type: 'error' }
      }));
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent to-[#050508]"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <div className="w-16 h-16 border-4 border-indigo-500/10 border-b-indigo-500 rounded-full animate-spin absolute top-0 left-0 animate-reverse" />
      </div>
      <h3 className="text-xl font-display font-semibold text-white tracking-wide mb-2">
        Synchronizing with Google SecOps
      </h3>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
        Verifying tokens and setting up your secure environment. Please stand by...
      </p>
    </motion.div>
  );
}