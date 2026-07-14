import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    document.title = 'Admin Authentication | COIMIQ';
    if (isAuthenticated) {
      navigate('/dashboard/bookings', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all credential fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back. Administrator session verified.', 'success');
      const from = location.state?.from?.pathname || '/dashboard/bookings';
      navigate(from, { replace: true });
    } catch (err) {
      // Capture detailed validation or conflict errors from ApiResponse JSON
      const errMsg = err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background gradients for premium aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-2xl shadow-lg shadow-violet-500/20 mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1" id="login-heading">
            COIMIQ Admin Portal
          </h1>
          <p className="text-sm text-slate-400">
            System administration credential checkpoint
          </p>
        </div>

        {/* Login Card */}
        <section className="bg-slate-900/60 border border-slate-900 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email-input" 
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  id="email-input"
                  type="email"
                  required
                  placeholder="admin@antigravity.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password-input" 
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={16} />
                </span>
                <input
                  id="password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              id="submit-login-button"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 active:translate-y-[1px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying Session...
                </span>
              ) : (
                'Access Console'
              )}
            </button>
          </form>
        </section>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-6 font-mono">
          SECURE ENCRYPTED CHANNEL // COIMIQ v1.0
        </p>
      </div>
    </main>
  );
};

export default Login;
