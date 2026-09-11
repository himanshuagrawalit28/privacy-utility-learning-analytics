import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Prediction from './pages/Prediction';
import Privacy from './pages/Privacy';
import Attack from './pages/Attack';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<Login />} />

          {/* Authenticated Application Shell Routes */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/attack" element={<Attack />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
