import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './views/Login';
import Bookings from './views/Bookings';
import Categories from './views/Categories';
import Venues from './views/Venues';
import Events from './views/Events';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Auth Endpoint */}
            <Route path="/login" element={<Login />} />

            {/* Shielded Admin Console Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Default View redirect */}
              <Route index element={<Navigate to="/dashboard/bookings" replace />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="categories" element={<Categories />} />
              <Route path="venues" element={<Venues />} />
              <Route path="events" element={<Events />} />
            </Route>

            {/* Fallback Redirection */}
            <Route path="*" element={<Navigate to="/dashboard/bookings" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
