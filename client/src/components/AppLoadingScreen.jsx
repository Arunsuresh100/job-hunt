import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

const AppLoadingScreen = ({ isFading }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-zinc-950 to-black text-white p-6 transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col items-center text-center space-y-6 relative z-10 max-w-xs">
        
        {/* Animated Glowing Logo */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-xl opacity-75 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-700/80 p-3 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="JobHunt Logo"
              className="w-full h-full object-contain drop-shadow-md animate-in zoom-in-75 duration-300"
            />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 capitalize">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>JobHunt Mobile Portal</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white capitalize">
            JobHunt Tracker
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed capitalize">
            Curated Entry-Level Tech Jobs & Exam Notifications
          </p>
        </div>

        {/* Loading Spinner & Progress Text */}
        <div className="w-full space-y-3 pt-4">
          <div className="flex items-center justify-center space-x-2 text-xs font-medium text-emerald-400">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span className="capitalize">Loading Curated Opportunities...</span>
          </div>

          <div className="w-48 mx-auto bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-[11px] font-mono text-zinc-500 capitalize">
        Official Portal Verified • Version 1.0.0
      </div>
    </div>
  );
};

export default AppLoadingScreen;
