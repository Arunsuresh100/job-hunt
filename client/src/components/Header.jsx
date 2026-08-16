import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, GraduationCap, Bookmark, RefreshCw, MapPin } from 'lucide-react';

const Header = ({ savedCount = 0, onSync, isSyncing = false, userProfile = null, onOpenProfileModal }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/jobs', label: 'Latest Jobs', icon: Briefcase, badge: '7 Days' },
    { path: '/kerala-jobs', label: 'Kerala Jobs', icon: MapPin, badge: '🌴 Kerala' },
    { path: '/exams', label: 'Exam Updates', icon: GraduationCap },
    { path: '/saved', label: 'Saved', icon: Bookmark, count: savedCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80 shadow-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* App Name & Logo - Left Side */}
          <Link to="/jobs" className="flex items-center space-x-2.5 group outline-none focus:outline-none focus-visible:outline-none select-none [-webkit-tap-highlight-color:transparent]">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-zinc-700 group-hover:scale-105 transition-all shadow-md">
              <img
                src="/logo.png"
                alt="JobHunt Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-zinc-200 transition-colors leading-none">
                JobHunt
              </span>
            </div>
          </Link>


          {/* Desktop Navigation Links - Center (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all outline-none focus:outline-none focus-visible:outline-none select-none [-webkit-tap-highlight-color:transparent] ${
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

          {/* Right Side Tools: Sync & Profile Avatar */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition-all active:scale-95 disabled:opacity-60 shadow-md outline-none focus:outline-none flex items-center justify-center"
              title={isSyncing ? "Syncing Feeds..." : "Sync Live Feeds"}
            >
              <RefreshCw className={`w-4 h-4 text-white ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Profile Avatar Button (Circular Icon Button matching Sync button size & padding) */}
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="p-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white transition-all active:scale-95 shadow-md outline-none focus:outline-none flex items-center justify-center"
              title={userProfile?.fullName ? `Edit Profile (${userProfile.fullName})` : 'Edit Candidate Profile'}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs flex items-center justify-center">
                {userProfile?.fullName
                  ? userProfile.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                  : 'A'}
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
