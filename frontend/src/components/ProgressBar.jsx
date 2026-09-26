import React from 'react';

const ProgressBar = ({ percent = 0 }) => {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Progress</span>
        <span>{clamped}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-brand-500 h-2 rounded-full transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
