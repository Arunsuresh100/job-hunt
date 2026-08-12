import React from 'react';

const StatCard = ({ title, value, description, icon: Icon, actionLabel, onAction }) => {
  return (
    <div className="mono-card p-5 rounded-xl flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400">
            {title}
          </span>
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>

        {description && (
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <button
            onClick={onAction}
            className="text-xs font-semibold text-white hover:text-zinc-300 flex items-center space-x-1"
          >
            <span>{actionLabel}</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StatCard;
