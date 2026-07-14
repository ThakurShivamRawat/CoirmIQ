import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Ticket, Compass, Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('antigravity_user_token');
  const userString = localStorage.getItem('antigravity_user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('antigravity_user_token');
    localStorage.removeItem('antigravity_user');
    window.dispatchEvent(new CustomEvent('antigravity-toast', {
      detail: { message: 'Logged out successfully', type: 'success' }
    }));
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full glass-panel border-x-0 border-t-0 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-display font-extrabold text-white text-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                C
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent group-hover:text-glow duration-300">
                COIMIQ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2
                ${isActive('/') 
                  ? 'bg-white/5 text-violet-400 border border-violet-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/3'}`}
            >
              <Compass className="w-4 h-4" />
              Discover
            </Link>

            <Link
              to="/my-tickets"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2
                ${isActive('/my-tickets') 
                  ? 'bg-white/5 text-violet-400 border border-violet-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/3'}`}
            >
              <Ticket className="w-4 h-4" />
              My Passes
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 text-xs font-bold uppercase border border-indigo-500/30">
                    {user.username ? user.username[0] : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[120px]">{user.username}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{user.city || 'Visitor'}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 flex items-center gap-2 active-click"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-300 active-click border border-violet-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-x-0 border-b-0 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-base transition-colors flex items-center gap-3
                  ${isActive('/') ? 'bg-white/5 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/3'}`}
              >
                <Compass className="w-5 h-5" />
                Discover Marketplace
              </Link>
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-base transition-colors flex items-center gap-3
                  ${isActive('/my-tickets') ? 'bg-white/5 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/3'}`}
              >
                <Ticket className="w-5 h-5" />
                My Passes Ledger
              </Link>

              <div className="pt-4 border-t border-white/5">
                {token && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold uppercase">
                        {user.username ? user.username[0] : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user.username}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-lg text-left text-base font-medium text-rose-400 hover:bg-rose-950/20 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-lg text-base font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-lg text-base font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
