import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  Map, 
  Layers, 
  LogOut, 
  User,
  Activity
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Sales Summary',
      path: '/dashboard/sales',
      icon: BarChart3,
      id: 'nav-sales'
    },
    {
      name: 'My Events',
      path: '/dashboard/events',
      icon: Calendar,
      id: 'nav-events'
    },
    {
      name: 'Venue Studio',
      path: '/dashboard/venues',
      icon: Map,
      id: 'nav-venues'
    },
    {
      name: 'Inventory Manager',
      path: '/dashboard/inventory',
      icon: Layers,
      id: 'nav-inventory'
    }
  ];

  return (
    <div className="flex h-screen bg-[#05070c] overflow-hidden">
      {/* Persistent Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between">
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block leading-none">COIMIQ</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Host Organizer</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  id={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - User Info & Logout */}
        <div className="p-4 border-t border-slate-800/50 space-y-3 bg-[#080c14]">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold border border-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate leading-tight">
                {user?.username || 'Host Organizer'}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Activity className="w-2.5 h-2.5" />
                HOST
              </span>
            </div>
          </div>

          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main View Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0B0F19]/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-200">Workspace Dashboard</h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Session: active
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#05070c] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
