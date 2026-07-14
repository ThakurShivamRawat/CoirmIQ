import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Layers, 
  MapPin, 
  Ticket, 
  LogOut, 
  ShieldAlert,
  User
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: 'Booking Audit',
      path: '/dashboard/bookings',
      icon: Ticket,
    },
    {
      name: 'Category CRUD',
      path: '/dashboard/categories',
      icon: Layers,
    },
    {
      name: 'Venues Audit',
      path: '/dashboard/venues',
      icon: MapPin,
    },
    {
      name: 'Event Moderation',
      path: '/dashboard/events',
      icon: Calendar,
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-900/40 flex flex-col shrink-0">
        {/* Branding header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-900 gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow shadow-violet-500/20">
            C
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">COIMIQ</h1>
            <p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 border border-indigo-500/30 text-indigo-300'
                    : 'text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Log Out */}
        <div className="p-4 border-t border-slate-900 bg-slate-900/20">
          <div className="flex items-center gap-3 px-2 py-3 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <User size={16} className="text-slate-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate" title={user?.username || 'Admin'}>
                {user?.username || 'System Admin'}
              </p>
              <p className="text-[10px] text-slate-500 truncate" title={user?.email || 'admin@antigravity.com'}>
                {user?.email || 'admin@antigravity.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/20 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-base font-semibold text-slate-200 capitalize">
            {menuItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-mono">SYSTEM ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
