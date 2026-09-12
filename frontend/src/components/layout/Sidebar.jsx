import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  LineChart, 
  X,
  Lock,
  Cpu
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Student Records', path: '/students', icon: Users, badge: '50+' },
  { name: 'Risk Predictor', path: '/prediction', icon: Sparkles, highlight: true },
  { name: 'Privacy Benchmark', path: '/privacy', icon: ShieldCheck },
  { name: 'Attack Visualizer', path: '/attack', icon: ShieldAlert, badge: 'MIA' },
  { name: 'Tradeoff Analytics', path: '/analytics', icon: LineChart },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                PrivaLearn AI
              </div>
              <div className="text-[10px] text-blue-600 font-mono tracking-wider uppercase font-semibold">
                Privacy ML Engine
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-600/15 to-indigo-500/10 text-blue-700 border border-cyan-500/30 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'
                  }`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    isActive 
                      ? 'bg-cyan-500/20 text-blue-700 border border-cyan-500/30' 
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* DP Budget Mini Card */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/40 m-3 rounded-2xl border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>DP Budget Consumed</span>
            </div>
            <span className="text-[11px] font-mono text-blue-600 font-semibold">12.5%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: '12.5%' }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Spent: ε = 1.25</span>
            <span>Limit: ε = 10.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
