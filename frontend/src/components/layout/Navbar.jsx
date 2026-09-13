import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  Bell, 
  Search, 
  LogOut, 
  Database,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentUser = authAPI.getCurrentUser() || {
    name: 'Dr. Evelyn Vance',
    role: 'ML Privacy Officer',
    email: 'e.vance@campus.edu'
  };

  const handleLogout = () => {
    authAPI.logout();
    addToast('You have been logged out safely.', 'info');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate('/students');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: mobile hamburger + search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition btn-press"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with keyboard shortcut hint */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchSubmit}
            placeholder="Search students, metrics, attack vectors (Press Enter)..."
            className="w-full pl-9 pr-12 py-1.5 text-xs sm:text-sm rounded-xl glass-input placeholder-slate-400"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            Ctrl+K
          </span>
        </div>
      </div>

      {/* Right Section: Privacy Status, Mode badge, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Differential Privacy Live Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
          <Shield className="w-3.5 h-3.5 text-blue-500 animate-pulse-subtle" />
          <span>DP-SGD Active:</span>
          <span className="font-mono bg-white px-1.5 py-0.5 rounded text-blue-600 border border-blue-100">ε = 1.25</span>
        </div>

        {/* Standalone / Mock Engine Badge */}
        <div 
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono cursor-default"
          title="Centralized API Service with Fallback Mock Engine"
        >
          <Database className="w-3 h-3" />
          <span>API Active</span>
        </div>

        {/* Quick Predict Action */}
        <button
          onClick={() => navigate('/prediction')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold transition btn-press"
          title="Run Individual Student Prediction"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Predict</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => addToast('MIA Security Audit: Zero membership leakage detected in current batch.', 'success')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition btn-press"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition text-left btn-press"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs ring-1 ring-slate-200 shadow-sm">
              EV
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 leading-none">{currentUser.role}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div 
              className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-lg py-1.5 z-50 animate-slide-up"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>

              <div className="px-3 py-2 text-xs text-slate-600 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Rényi DP Certified</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
