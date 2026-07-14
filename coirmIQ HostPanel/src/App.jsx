import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationBanner from './components/NotificationBanner';

// Views
import Login from './views/Login';
import Register from './views/Register';
import DashboardLayout from './views/DashboardLayout';
import SalesSummary from './views/SalesSummary';
import EventsWorkspace from './views/EventsWorkspace';
import VenueLayoutStudio from './views/VenueLayoutStudio';
import InventoryManager from './views/InventoryManager';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Absolute floating notifications */}
        <NotificationBanner />
        
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Layout Routes */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="sales" element={<SalesSummary />} />
              <Route path="events" element={<EventsWorkspace />} />
              <Route path="venues" element={<VenueLayoutStudio />} />
              <Route path="inventory" element={<InventoryManager />} />
              <Route path="" element={<Navigate to="sales" replace />} />
            </Route>
          </Route>

          {/* Fallback Redirection */}
          <Route path="/" element={<Navigate to="/dashboard/sales" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/sales" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
