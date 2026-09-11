import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ShieldCheck } from 'lucide-react';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-4 px-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>
                <strong>PrivaLearn AI</strong> — Privacy-Preserving Student Risk Intelligence with Differential Privacy (DP-SGD).
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-emerald-400">● FERPA & GDPR Compliant</span>
              <span className="text-slate-500">v1.0.4-rc</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
