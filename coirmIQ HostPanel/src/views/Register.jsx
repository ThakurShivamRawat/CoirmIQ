import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, User, ShieldCheck, Phone } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobNo, setMobNo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username || !password || !mobNo) return;

    setSubmitting(true);
    const result = await register(email, username, password, mobNo);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard/sales');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md dark-card p-8 border-slate-800/80 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 id="register-title" className="text-2xl font-bold tracking-tight text-white mb-2">
            Create Host Account
          </h1>
          <p className="text-slate-400 text-sm">
            Sign up to get authorized as an Antigravity event host organizer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@antigravity.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User className="w-5 h-5" />
              </span>
              <input
                id="register-username"
                type="text"
                required
                minLength={3}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <input
                id="register-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Phone className="w-5 h-5" />
              </span>
              <input
                id="register-mob-no"
                type="text"
                required
                value={mobNo}
                onChange={(e) => setMobNo(e.target.value)}
                placeholder="+1 555-0199"
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Hidden Role: HOST indication */}
          <input type="hidden" name="role" value="HOST" />

          <button
            id="register-submit-btn"
            type="submit"
            disabled={submitting}
            className="w-full btn-primary mt-4 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register as Host</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm border-t border-slate-800/80 pt-6">
          <p className="text-slate-400">
            Already have a host account?{' '}
            <Link id="goto-login-link" to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
