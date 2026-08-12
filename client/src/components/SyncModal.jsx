import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Globe, Building2, X } from 'lucide-react';

const SyncModal = ({ isOpen, isSyncing, syncResult, onClose, syncStep = '', progress = 0 }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl shadow-emerald-500/10 overflow-hidden">
        
        {/* Ambient Backlight Effects */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button (When finished or errored) */}
        {!isSyncing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800/80 transition-colors outline-none focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Main Content */}
        <div className="flex flex-col items-center text-center space-y-4 relative z-10">
          
          {/* Animated Status Icon Badge */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl transition-all duration-300 ${
              isSyncing
                ? 'bg-gradient-to-tr from-emerald-600/30 to-indigo-600/30 border-emerald-500/50 shadow-emerald-500/20'
                : syncResult?.success
                ? 'bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 border-emerald-400 shadow-emerald-400/20'
                : 'bg-gradient-to-tr from-rose-500/30 to-amber-500/30 border-rose-500 shadow-rose-500/20'
            }`}>
              {isSyncing ? (
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              ) : syncResult?.success ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-400" />
              )}
            </div>
            
            {isSyncing && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            )}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {isSyncing
                ? 'Syncing Live Job Feeds'
                : syncResult?.success
                ? 'Sync Completed Successfully!'
                : 'Sync Encountered An Error'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
              {isSyncing
                ? 'Fetching & indexing real-time entry-level job drives across remote APIs and Kerala IT Parks.'
                : syncResult?.message || 'Synchronization finished.'}
            </p>
          </div>

          {/* Live Progress Bar & Adapters Status */}
          {isSyncing && (
            <div className="w-full space-y-3 pt-2">
              <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800 p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(15, progress)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left pt-1">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center space-x-2 text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-zinc-300 truncate">Adzuna & Remotive</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center space-x-2 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="text-zinc-300 truncate">Kerala Tech Parks</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-emerald-400 font-semibold animate-pulse">
                {syncStep || 'Processing job postings...'}
              </div>
            </div>
          )}

          {/* Sync Result Summary Stats */}
          {!isSyncing && syncResult?.success && (
            <div className="w-full space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 flex items-center justify-around text-xs font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-400 capitalize tracking-tight">Feed Status</span>
                  <span className="text-sm font-bold text-emerald-400">Live & Synced</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-zinc-400 capitalize tracking-tight">Filter Window</span>
                  <span className="text-sm font-bold text-white">Last 7 Days</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs transition-all active:scale-95 shadow-md shadow-emerald-500/20 capitalize outline-none focus:outline-none"
              >
                Done & Refresh Feed
              </button>
            </div>
          )}

          {!isSyncing && !syncResult?.success && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-all active:scale-95 capitalize outline-none focus:outline-none"
            >
              Close
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default SyncModal;
