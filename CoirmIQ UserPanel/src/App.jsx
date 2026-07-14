import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ToastManager from './components/ToastManager';
import ProtectedRoute from './components/ProtectedRoute';

// Views
import Home from './views/Home';
import EventDetail from './views/EventDetail';
import Checkout from './views/Checkout';
import MyTickets from './views/MyTickets';
import Login from './views/Login';
import Register from './views/Register';
import OAuth2Redirect from './views/OAuth2Redirect';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#050508] text-slate-200">
        {/* Global Translucent Navbar */}
        <Navbar />
        
        {/* Route Pages Container */}
        <main className="flex-grow">
          <Routes>
            {/* Public Discovery Hub & Event Details */}
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetail />} />
            
            {/* Auth Flows */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

            {/* Protected Checkout & Customer Ledger (Enforced via JWT Verification) */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Global Custom Toast Alerts Banner */}
        <ToastManager />

        {/* Premium Dark Minimalist Footer */}
        <footer className="py-8 text-center border-t border-white/5 text-xs text-slate-500 font-semibold bg-black/20">
          <p>© 2026 COIMIQ Ticket Marketplace. Developed in React, Tailwind, and Spring Security.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
