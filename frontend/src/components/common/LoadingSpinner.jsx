import React from 'react';

export default function LoadingSpinner({ text = 'Loading data...', size = 'default' }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div 
        className={`${sizeClasses[size] || sizeClasses.default} border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin`}
      />
      {text && <p className="text-xs text-slate-500 font-mono tracking-wide">{text}</p>}
    </div>
  );
}
