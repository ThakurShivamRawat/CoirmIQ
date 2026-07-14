import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, User, Lock, Phone, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobNo, setMobNo] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !username || !password || !mobNo) {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: 'Please enter email, username, password, and mobile number.', type: 'warning' }
      }));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/register', {
        email,
        username,
        password,
        mobNo,
        city: city || 'Las Vegas', // default or custom
        role: 'USER' // Hidden injected parameter
      });

      const { token, user } = response.data.data;
      localStorage.setItem('antigravity_user_token', token);
      localStorage.setItem('antigravity_user', JSON.stringify(user));

      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: `Account established! Welcome, ${user.username || 'User'}`, type: 'success' }
      }));

      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // api.js response interceptor handles triggering toasts
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 overflow-hidden py-12">
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
            Establish Credentials
          </h2>
          <p className="text-slate-400 text-sm">
            Create an elite user profile to book festival experiences
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* Username input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="quantum_coder"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* Mobile Number input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                required
                value={mobNo}
                onChange={(e) => setMobNo(e.target.value)}
                placeholder="+1 555 0199"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm text-white glass-input font-medium"
              />
            </div>
          </div>

          {/* City input (Optional but premium) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase pl-1">
              Primary City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York, Las Vegas"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white glass-input font-medium"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.01] active-click transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Register Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footnote */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Enter Portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
