import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine where to redirect after login (default is home)
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Please enter both email and password.', type: 'warning' }
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
        role: 'USER' // Hidden injected parameter
      });

      const { token, user } = response.data.data;
      localStorage.setItem('antigravity_user_token', token);
      localStorage.setItem('antigravity_user', JSON.stringify(user));

      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: `Welcome back, ${user.username || 'User'}!`, type: 'success' }
      }));

      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      // api.js response interceptor handles error dispatching to ToastManager
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden">
      {/* Background glow ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-panel-heavy p-8 rounded-2xl shadow-2xl relative z-10 border border-white/5"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold tracking-tight text-white mb-2">
            Access Portal
          </h2>
          <p className="text-slate-400 text-sm">
            Sign in to claim your marketplace passes
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.01] active-click transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Marketplace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative px-3 bg-[#0c0c14] text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Or Alternate Route
          </span>
        </div>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 flex items-center justify-center gap-3 active-click mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-400">
          New to COIMIQ?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Establish Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
