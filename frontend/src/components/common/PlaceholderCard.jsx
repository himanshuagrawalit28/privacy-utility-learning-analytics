import React from 'react';
import { Layers } from 'lucide-react';

export default function PlaceholderCard({ title, path, description, icon: Icon = Layers }) {
  return (
    <div className="space-y-6">
      {/* Route Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
          <Icon className="w-4 h-4" />
          <span>Route: {path}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-2xl">
          {description}
        </p>
      </div>

      {/* Placeholder Body Wireframe */}
      <div className="glass-card rounded-2xl p-8 border border-dashed border-slate-700 text-center flex flex-col items-center justify-center min-h-[350px] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/60 text-blue-700 border border-cyan-500/30 mb-2">
            Phase 1 Placeholder
          </span>
          <h2 className="text-lg font-bold text-white">
            {title} Component Ready
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Layout, navigation routing, and boilerplate verified. Complete UI and mock data will be populated in Phase 2.
          </p>
        </div>

        {/* Wireframe Skeletons */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3 pt-2">
          <div className="h-16 rounded-xl bg-white/80 border border-slate-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-white/80 border border-slate-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-white/80 border border-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
