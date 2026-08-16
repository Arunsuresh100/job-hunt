import React from 'react';

const AppLoadingScreen = ({ isFading }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-zinc-950 text-white p-8 transition-opacity duration-400 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Spacer for centering */}
      <div className="h-6" />

      {/* Main Center Content */}
      <div className="flex flex-col items-center text-center space-y-6 relative z-10 max-w-xs">
        
        {/* App Logo with subtle glow ring */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-3xl blur-lg animate-pulse" />
          <div className="relative w-28 h-28 rounded-2xl bg-zinc-900 border border-zinc-800/90 p-3 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="JobHunt Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-white">
            JobHunt
          </h1>
          <p className="text-xs font-medium text-zinc-400 tracking-wide">
            Entry-Level Tech Jobs & Exam Portal
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-40 pt-4">
          <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden border border-zinc-800/80">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full animate-pulse w-4/5" />
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
        Verified Job Tracker • v1.0
      </div>
    </div>
  );
};

export default AppLoadingScreen;
