import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-4 w-24 bg-slate-700/60 rounded" />
      <div className="h-6 w-6 bg-slate-700/60 rounded-full" />
    </div>
    <div className="h-8 w-32 bg-slate-700/80 rounded" />
    <div className="h-3 w-40 bg-slate-700/40 rounded" />
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 flex items-center justify-between">
        <div className="h-4 w-1/4 bg-slate-700/60 rounded" />
        <div className="h-4 w-1/6 bg-slate-700/50 rounded" />
        <div className="h-4 w-1/6 bg-slate-700/50 rounded" />
        <div className="h-6 w-16 bg-slate-700/70 rounded-full" />
      </div>
    ))}
  </div>
);
