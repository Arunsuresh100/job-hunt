import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, GraduationCap, Bookmark, RefreshCw } from 'lucide-react';

const Navbar = ({ savedCount = 0, onSync, isSyncing = false }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // The 3 core app destination tabs
  const navLinks = [
    { path: '/jobs', label: 'Latest Jobs', shortLabel: 'Jobs', icon: Briefcase, badge: '7 Days' },
    { path: '/exams', label: 'Exam Updates', shortLabel: 'Exams', icon: GraduationCap },
    { path: '/saved', label: 'Saved', shortLabel: 'Saved', icon: Bookmark, count: savedCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Title (Visible on BOTH Mobile & Desktop Header) */}
          <Link to="/jobs" className="flex items-center space-x-2.5 group">
            <div className="px-2.5 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-purple-500/20 border border-white/20 tracking-wider group-hover:scale-105 transition-transform">
              MCA
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors leading-none">
                FreshJobs & Exams
              </span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline-block">
                Tracker Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-zinc-800/90 text-white border border-zinc-700/90 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {link.badge}
                    </span>
                  )}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-purple-500 text-white font-mono">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Top Header Sync Feeds Action (Mobile & Desktop) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
              title="Sync Live Feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="capitalize">{isSyncing ? 'Syncing...' : 'Sync Feeds'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (The 3 Core App Tabs) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/90 px-3 py-2 flex items-center justify-between shadow-2xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex-1 flex flex-col items-center justify-center space-y-1 py-1.5 px-2 rounded-xl transition-all relative ${
                active
                  ? 'text-white bg-zinc-900/90 border border-zinc-800/80 shadow-inner'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-indigo-400' : ''}`} />
                {link.count !== undefined && link.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-purple-500 text-white shadow-sm font-mono">
                    {link.count}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight capitalize ${active ? 'font-bold text-white' : 'font-medium text-zinc-400'}`}>
                {link.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;


